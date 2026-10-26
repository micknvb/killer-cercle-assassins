const express = require("express");
const fs = require("fs");
const path = require("path");
const { DEFAULT_SCENARIOS } = require("./scenarios");
const {
  AVATARS,
  generateDefaultPhoto,
  generateToken,
  generatePin,
  normalizePhone,
  pickRandomScenario,
  verifySingleCycle,
  createGame,
  launchFromLobby
} = require("./engine");

function createApp(options = {}) {
  const app = express();
  app.use(express.json({ limit: "8mb" }));
  app.use((req, res, next) => {
    if (req.path.endsWith(".js") || req.path.endsWith(".css") || req.path.endsWith(".html") || req.path === "/" || req.path === "/admin" || req.path.startsWith("/p/")) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
    next();
  });
  app.use(express.static(path.join(__dirname, "public"), { etag: false, lastModified: false, maxAge: 0 }));

  const DATA_DIR = options.dataDir || process.env.DATA_DIR || path.join(__dirname, "..", "data");
  const STATE_FILE = path.join(DATA_DIR, "killer-state.json");
  const ADMIN_PASSWORD = options.adminPassword || process.env.ADMIN_PASSWORD || "change-me-in-env";
  const PUBLIC_URL = (options.publicUrl || process.env.PUBLIC_URL || "http://localhost:3000").replace(/\/$/, "");

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  function defaultState() {
    return {
      scenarios: [...DEFAULT_SCENARIOS],
      contacts: [],
      commConfig: {
        preferredChannel: "sms_external",
        externalProvider: "brevo",
        autoSendOnStart: false,
        autoSendOnScenarioChange: false,
        autoSendOnKill: false,
        brevoApiKey: "",
        brevoSender: "KILLER",
        octopushLogin: "",
        octopushApiKey: "",
        octopushSender: "KILLER",
        ovhWebhookOrProxyUrl: "",
        ovhAppKey: "",
        ovhConsumerKey: "",
        ovhServiceName: "",
        ovhSender: "KILLER",
        twilioSid: "",
        twilioToken: "",
        twilioFrom: "",
        freeUser: "",
        freePass: "",
        webhookUrl: "",
        googleClientId: "",
        googleApiKey: ""
      },
      commLogs: [],
      game: null,
      history: []
    };
  }

  let state = defaultState();

  function enrichScenarioBilingual(sc) {
    if (!sc) return sc;
    const match = DEFAULT_SCENARIOS.find(d => d.id === sc.id);
    if (match) {
      return {
        ...match,
        ...sc,
        title_en: sc.title_en || match.title_en,
        category_en: sc.category_en || match.category_en,
        difficulty_en: sc.difficulty_en || match.difficulty_en,
        description_en: sc.description_en || match.description_en,
        tip_en: sc.tip_en || match.tip_en
      };
    }
    return sc;
  }

  function loadState() {
    try {
      if (fs.existsSync(STATE_FILE)) {
        const raw = fs.readFileSync(STATE_FILE, "utf8");
        const parsed = JSON.parse(raw);
        state = {
          ...defaultState(),
          ...parsed,
          commConfig: { ...defaultState().commConfig, ...(parsed.commConfig || {}) }
        };
        if (!Array.isArray(state.scenarios) || state.scenarios.length === 0) {
          state.scenarios = [...DEFAULT_SCENARIOS];
        } else {
          state.scenarios = state.scenarios.map(enrichScenarioBilingual);
        }
        if (state.game && Array.isArray(state.game.players)) {
          state.game.players = state.game.players.map((p, idx) => ({
            ...p,
            photoUrl: p.photoUrl || generateDefaultPhoto(p.name, idx),
            lang: p.lang || "fr",
            rsvpStatus: p.rsvpStatus || (state.game.status === "lobby" ? "pending" : "accepted"),
            onboarded: Boolean(p.onboarded),
            scenario: enrichScenarioBilingual(p.scenario)
          }));
        }
      } else {
        saveState();
      }
    } catch (err) {
      console.error("Error loading state:", err);
    }
  }

  function saveState() {
    try {
      const tmp = STATE_FILE + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(state, null, 2), "utf8");
      fs.renameSync(tmp, STATE_FILE);
    } catch (err) {
      console.error("Error saving state:", err);
    }
  }

  loadState();

  // --- Server-Sent Events (SSE) ---
  const sseClients = new Set();

  function broadcastEvent(type, payload = {}) {
    const msg = `data: ${JSON.stringify({ type, payload, timestamp: Date.now() })}\n\n`;
    for (const res of sseClients) {
      try {
        res.write(msg);
      } catch (_) {
        sseClients.delete(res);
      }
    }
  }

  app.get("/api/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    res.write(`data: ${JSON.stringify({ type: "connected", timestamp: Date.now() })}\n\n`);
    sseClients.add(res);
    req.on("close", () => sseClients.delete(res));
  });

  // --- Admin Auth Middleware ---
  const adminSessions = new Set();

  function requireAdmin(req, res, next) {
    const authHeader = req.headers["x-admin-token"] || req.query.adminToken;
    if (authHeader && adminSessions.has(authHeader)) {
      return next();
    }
    return res.status(401).json({ error: "Non autorisé. Veuillez vous connecter en tant que Maître du Jeu." });
  }

  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body || {};
    if (password === ADMIN_PASSWORD) {
      const token = generateToken(16);
      adminSessions.add(token);
      return res.json({ ok: true, token });
    }
    return res.status(401).json({ error: "Mot de passe Maître du Jeu incorrect." });
  });

  // --- External SMS Dispatcher ---
  async function sendExternalSms(toPhone, message, playerName = "", overrideProvider = null) {
    const phone = normalizePhone(toPhone);
    if (!phone) {
      throw new Error(`Numéro de téléphone manquant ou invalide pour ${playerName || "ce destinataire"}.`);
    }
    const cfg = state.commConfig;
    const provider = overrideProvider || cfg.externalProvider || "brevo";
    let resultInfo = "";

    if (provider === "brevo") {
      if (!cfg.brevoApiKey) {
        throw new Error("Clé API Brevo non configurée. Renseigne ta clé API v3 (xkeysib-...) dans la section Brevo SMS.");
      }
      const resp = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": cfg.brevoApiKey.trim(),
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: (cfg.brevoSender || "KILLER").replace(/[^a-zA-Z0-9]/g, "").slice(0, 11) || "KILLER",
          recipient: phone,
          content: message,
          type: "transactional"
        })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(`Brevo SMS erreur (${resp.status}): ${data.message || data.code || JSON.stringify(data)}`);
      }
      resultInfo = `Brevo MessageID: ${data.messageId || data.reference || "Envoyé"} (Crédits restants: ${data.remainingCredits ?? "OK"})`;
    } else if (provider === "octopush") {
      if (!cfg.octopushLogin || !cfg.octopushApiKey) {
        throw new Error("Identifiants Octopush (Login + Clé API) non configurés.");
      }
      const resp = await fetch("https://api.octopush.com/v1/public/sms-campaign/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-login": cfg.octopushLogin,
          "api-key": cfg.octopushApiKey
        },
        body: JSON.stringify({
          recipients: [{ phone_number: phone, first_name: playerName }],
          text: message,
          type: "sms_premium",
          purpose: "alert",
          sender: (cfg.octopushSender || "KILLER").slice(0, 11)
        })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(`Octopush erreur (${resp.status}): ${data.message || JSON.stringify(data)}`);
      }
      resultInfo = `Octopush Ticket: ${data.ticket || "OK"}`;
    } else if (provider === "twilio") {
      if (!cfg.twilioSid || !cfg.twilioToken || !cfg.twilioFrom) {
        throw new Error("Identifiants Twilio (Account SID, Auth Token, From) non configurés.");
      }
      const auth = Buffer.from(`${cfg.twilioSid}:${cfg.twilioToken}`).toString("base64");
      const params = new URLSearchParams();
      params.append("To", phone);
      params.append("From", cfg.twilioFrom);
      params.append("Body", message);
      const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${cfg.twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(`Twilio erreur (${resp.status}): ${data.message || JSON.stringify(data)}`);
      }
      resultInfo = `Twilio SID: ${data.sid || "OK"}`;
    } else if (provider === "freemobile") {
      if (!cfg.freeUser || !cfg.freePass) {
        throw new Error("Identifiants Free Mobile (user + pass) non configurés.");
      }
      const url = `https://smsapi.free-mobile.fr/sendmsg?user=${encodeURIComponent(cfg.freeUser)}&pass=${encodeURIComponent(cfg.freePass)}&msg=${encodeURIComponent(message)}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Free Mobile API erreur HTTP ${resp.status}`);
      }
      resultInfo = "Free Mobile SMS envoyé";
    } else if (provider === "ovh" || provider === "webhook") {
      const targetUrl = provider === "ovh" ? (cfg.ovhWebhookOrProxyUrl || cfg.webhookUrl) : cfg.webhookUrl;
      if (!targetUrl) {
        throw new Error("URL Webhook / Passerelle OVH non configurée.");
      }
      const resp = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          to: phone,
          playerName,
          message,
          sender: cfg.ovhSender || "KILLER",
          timestamp: new Date().toISOString()
        })
      });
      if (!resp.ok) {
        throw new Error(`Webhook erreur HTTP ${resp.status}`);
      }
      resultInfo = `Webhook ${resp.status} OK`;
    } else {
      throw new Error(`Fournisseur SMS inconnu : ${provider}`);
    }

    const logEntry = {
      id: generateToken(4),
      timestamp: new Date().toISOString(),
      playerName,
      phone,
      provider,
      message,
      status: "sent",
      detail: resultInfo
    };
    state.commLogs.unshift(logEntry);
    state.commLogs = state.commLogs.slice(0, 100);
    saveState();
    return logEntry;
  }

  function buildPlayerMessage(player, target, type = "start", customNote = "") {
    const link = `${PUBLIC_URL}/p/${player.token}`;
    const isEn = player.lang === "en";
    const targetName = target ? target.name : (isEn ? "None" : "Aucune");
    const sc = player.scenario || {};
    const scenarioTitle = isEn ? (sc.title_en || sc.title || "Secret Mission") : (sc.title || "Mission secrète");
    const scenarioDesc = isEn ? (sc.description_en || sc.description || "") : (sc.description || "");

    if (type === "invite") {
      if (isEn) {
        return `🎟️ *INVITATION — CIRCLE OF ASSASSINS* 🕵️\nHi ${player.name}! You are invited to play the Killer Game tonight.\n\n👉 Tap your personal link to read the rules, add your profile photo, and confirm if you're playing:\n${link}`;
      }
      return `🎟️ *INVITATION — LE CERCLE DES ASSASSINS* 🕵️\nSalut ${player.name} ! Tu es invité(e) au Jeu du Killer pour la soirée.\n\n👉 Clique sur ton lien personnel pour découvrir les règles, ajouter ta photo de profil et valider ta participation :\n${link}`;
    }

    if (isEn) {
      if (type === "start") {
        return `🎯 *CIRCLE OF ASSASSINS* 🎯\nHi ${player.name}! The game has started.\n\n🕵️ *Your Target:* ${targetName}\n📜 *Mission (${scenarioTitle}):* ${scenarioDesc}\n🔐 *Your PIN / Autopsy Code:* ${player.pin}\n\n👉 *Your live secret dossier:*\n${link}`;
      }
      if (type === "scenario_change") {
        return `🔄 *MISSION UPDATE (GM)*\nHi ${player.name}, your murder scenario on *${targetName}* has been updated!\n\n🆕 *New Mission (${scenarioTitle}):* ${scenarioDesc}\n\n👉 *Open your dossier:* ${link}`;
      }
      if (type === "new_target") {
        return `🗡️ *KILL CONFIRMED!*\nWell done ${player.name}! Here is your new contract:\n\n🎯 *New Target:* ${targetName}\n📜 *New Mission (${scenarioTitle}):* ${scenarioDesc}\n\n👉 *Secret dossier:* ${link}`;
      }
      if (type === "eliminated") {
        return `💀 *YOU HAVE BEEN ELIMINATED...*\nHi ${player.name}, your contract ends here! Thanks for playing fair.\n\n👉 *Follow the survivors:* ${link}`;
      }
      return `📢 *GAME MASTER MESSAGE*\nHi ${player.name}: ${customNote || "Check your player page!"}\n\n👉 ${link}`;
    }

    if (type === "start") {
      return `🎯 *LE CERCLE DES ASSASSINS* 🎯\nSalut ${player.name} ! La partie commence.\n\n🕵️ *Ta Cible :* ${targetName}\n📜 *Ta Mission (${scenarioTitle}) :* ${scenarioDesc}\n🔐 *Ton Code PIN / Autopsie :* ${player.pin}\n\n👉 *Ton dossier secret en direct :*\n${link}`;
    }
    if (type === "scenario_change") {
      return `🔄 *MISE À JOUR DE MISSION (MJ)*\nSalut ${player.name}, ton scénario de meurtre sur *${targetName}* a été remplacé !\n\n🆕 *Nouvelle Mission (${scenarioTitle}) :* ${scenarioDesc}\n\n👉 *Voir ton dossier :* ${link}`;
    }
    if (type === "new_target") {
      return `🗡️ *ÉLIMINATION CONFIRMÉE !*\nBravo ${player.name} ! Voici ton nouveau contrat :\n\n🎯 *Nouvelle Cible :* ${targetName}\n📜 *Nouvelle Mission (${scenarioTitle}) :* ${scenarioDesc}\n\n👉 *Dossier secret :* ${link}`;
    }
    if (type === "eliminated") {
      return `💀 *TU AS ÉTÉ ÉLIMINÉ(E)...*\nSalut ${player.name}, ton contrat s'arrête ici ! Merci d'avoir joué le jeu avec fair-play.\n\n👉 *Suivre les survivants :* ${link}`;
    }
    return `📢 *MESSAGE DU MAÎTRE DU JEU*\nSalut ${player.name} : ${customNote || "Consulte ta page joueur !"}\n\n👉 ${link}`;
  }

  // --- Public API ---
  app.get("/api/health", (req, res) => {
    res.json({
      ok: true,
      service: "killer-cercle-assassins",
      cycleValid: state.game && state.game.status === "active" ? verifySingleCycle(state.game.players) : true,
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/public/summary", (req, res) => {
    const g = state.game;
    if (!g) {
      return res.json({
        hasGame: false,
        publicUrl: PUBLIC_URL,
        scenariosCount: state.scenarios.length
      });
    }
    const alivePlayers = g.players.filter(p => p.alive);
    const acceptedCount = g.players.filter(p => p.rsvpStatus === "accepted").length;
    const pendingCount = g.players.filter(p => p.rsvpStatus === "pending").length;
    const declinedCount = g.players.filter(p => p.rsvpStatus === "declined").length;

    const topKillers = [...g.players]
      .sort((a, b) => (b.kills?.length || 0) - (a.kills?.length || 0))
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        photoUrl: p.photoUrl,
        killsCount: p.kills?.length || 0,
        alive: p.alive
      }));

    return res.json({
      hasGame: true,
      publicUrl: PUBLIC_URL,
      scenariosCount: state.scenarios.length,
      game: {
        id: g.id,
        name: g.name,
        status: g.status,
        createdAt: g.createdAt,
        startedAt: g.startedAt,
        finishedAt: g.finishedAt,
        settings: g.settings,
        totalPlayers: g.players.length,
        aliveCount: alivePlayers.length,
        eliminatedCount: g.status === "lobby" ? 0 : g.players.length - alivePlayers.length,
        rsvpCounts: {
          accepted: acceptedCount,
          pending: pendingCount,
          declined: declinedCount
        },
        winner: g.winner || null,
        topKillers,
        playersList: g.players.map(p => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          photoUrl: p.photoUrl,
          rsvpStatus: p.rsvpStatus || "accepted",
          alive: p.alive,
          killsCount: p.kills?.length || 0
        })),
        announcements: (g.announcements || []).filter(a => a.targetPlayerId === "all").slice(0, 15)
      }
    });
  });

  function formatPlayerDossier(player, game) {
    const target = game.players.find(p => p.id === player.targetId) || null;
    const aliveCount = game.players.filter(p => p.alive).length;
    const personalAnnouncements = (game.announcements || []).filter(
      a => a.targetPlayerId === "all" || a.targetPlayerId === player.id
    ).slice(0, 20);

    const acceptedPeers = game.players
      .filter(p => p.rsvpStatus === "accepted")
      .map(p => ({ id: p.id, name: p.name, photoUrl: p.photoUrl, avatar: p.avatar }));

    const rsvpCounts = {
      accepted: game.players.filter(p => p.rsvpStatus === "accepted").length,
      pending: game.players.filter(p => !p.rsvpStatus || p.rsvpStatus === "pending").length,
      declined: game.players.filter(p => p.rsvpStatus === "declined").length
    };

    return {
      gameId: game.id,
      gameName: game.name,
      gameStatus: game.status,
      settings: game.settings,
      totalPlayers: game.players.length,
      aliveCount,
      rsvpCounts,
      acceptedPeers,
      winner: game.winner || null,
      player: {
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        photoUrl: player.photoUrl,
        hasCustomPhoto: Boolean(player.hasCustomPhoto),
        lang: player.lang || "fr",
        rsvpStatus: player.rsvpStatus || "pending",
        rsvpUpdatedAt: player.rsvpUpdatedAt || null,
        onboarded: Boolean(player.onboarded),
        pin: player.pin,
        token: player.token,
        link: `${PUBLIC_URL}/p/${player.token}`,
        alive: player.alive,
        immunityUntil: player.immunityUntil || null,
        kills: player.kills || [],
        killedBy: player.killedBy || null,
        scenario: player.alive && game.status === "active" ? enrichScenarioBilingual(player.scenario) : null,
        target: player.alive && game.status === "active" && target && target.id !== player.id
          ? {
              id: target.id,
              name: target.name,
              avatar: target.avatar,
              photoUrl: target.photoUrl,
              immunityUntil: target.immunityUntil || null
            }
          : null
      },
      announcements: personalAnnouncements
    };
  }

  app.get("/api/player/by-token/:token", (req, res) => {
    const g = state.game;
    if (!g) return res.status(404).json({ error: "Aucune partie en cours." });
    const player = g.players.find(p => p.token === req.params.token);
    if (!player) return res.status(404).json({ error: "Lien joueur introuvable ou expiré." });
    return res.json(formatPlayerDossier(player, g));
  });

  app.post("/api/player/login", (req, res) => {
    const { playerId, pin } = req.body || {};
    const g = state.game;
    if (!g) return res.status(404).json({ error: "Aucune partie en cours." });
    const player = g.players.find(p => p.id === playerId || p.name.toLowerCase() === String(playerId || "").toLowerCase());
    if (!player) return res.status(404).json({ error: "Joueur introuvable." });
    if (String(player.pin).trim() !== String(pin || "").trim()) {
      return res.status(401).json({ error: "Code PIN à 4 chiffres incorrect." });
    }
    return res.json(formatPlayerDossier(player, g));
  });

  // First-connection onboarding, RSVP & profile update (language + photo + participation)
  app.post("/api/player/profile", (req, res) => {
    const { token, lang, photoUrl, portraitIndex, rsvpStatus, onboarded } = req.body || {};
    const g = state.game;
    if (!g) return res.status(404).json({ error: "Aucune partie en cours." });
    const player = g.players.find(p => p.token === token);
    if (!player) return res.status(404).json({ error: "Joueur introuvable." });

    if (lang === "fr" || lang === "en") {
      player.lang = lang;
    }
    if (photoUrl && String(photoUrl).startsWith("data:image/")) {
      player.photoUrl = photoUrl;
      player.hasCustomPhoto = true;
    } else if (portraitIndex !== undefined && portraitIndex !== null) {
      player.photoUrl = generateDefaultPhoto(player.name, Number(portraitIndex) || 0);
    }
    if (rsvpStatus === "accepted" || rsvpStatus === "declined" || rsvpStatus === "pending") {
      player.rsvpStatus = rsvpStatus;
      player.rsvpUpdatedAt = new Date().toISOString();
    }
    if (onboarded !== undefined) {
      player.onboarded = Boolean(onboarded);
    } else {
      player.onboarded = true;
    }

    saveState();
    broadcastEvent("game_updated", {
      event: "player_profile_updated",
      playerId: player.id,
      playerName: player.name,
      rsvpStatus: player.rsvpStatus
    });
    return res.json({ ok: true, dossier: formatPlayerDossier(player, g) });
  });

  async function executeKill(game, killer, victim, method = "player") {
    if (!killer.alive) throw new Error("Tu es déjà éliminé(e) et ne peux plus commettre de meurtre.");
    if (!victim || !victim.alive) throw new Error("Cette cible est déjà éliminée.");
    if (killer.targetId !== victim.id) throw new Error("Ce joueur n'est pas ta cible actuelle !");

    if (victim.immunityUntil && victim.immunityUntil > Date.now() && method !== "gm_force") {
      const mins = Math.ceil((victim.immunityUntil - Date.now()) / 60000);
      throw new Error(`${victim.name} bénéficie d'une immunité suite à une contre-attaque pendant encore ${mins} min !`);
    }

    game.undoStack = game.undoStack || [];
    game.undoStack.push(JSON.stringify({
      players: game.players,
      status: game.status,
      winner: game.winner,
      killLog: game.killLog
    }));
    if (game.undoStack.length > 30) game.undoStack.shift();

    const now = new Date().toISOString();
    const usedScenario = killer.scenario
      ? enrichScenarioBilingual({ ...killer.scenario })
      : { title: "Mission spéciale", title_en: "Special Mission", description: "", description_en: "" };

    killer.kills = killer.kills || [];
    killer.kills.push({
      id: generateToken(4),
      victimId: victim.id,
      victimName: victim.name,
      victimAvatar: victim.avatar,
      victimPhotoUrl: victim.photoUrl,
      scenarioTitle: usedScenario.title,
      scenarioTitle_en: usedScenario.title_en || usedScenario.title,
      scenarioDescription: usedScenario.description,
      scenarioDescription_en: usedScenario.description_en || usedScenario.description,
      timestamp: now
    });

    victim.alive = false;
    victim.killedBy = {
      killerId: killer.id,
      killerName: killer.name,
      killerAvatar: killer.avatar,
      killerPhotoUrl: killer.photoUrl,
      scenarioTitle: usedScenario.title,
      scenarioTitle_en: usedScenario.title_en || usedScenario.title,
      scenarioDescription: usedScenario.description,
      scenarioDescription_en: usedScenario.description_en || usedScenario.description,
      timestamp: now
    };

    killer.targetId = victim.targetId;
    killer.scenario = victim.scenario ? enrichScenarioBilingual({ ...victim.scenario }) : null;

    game.killLog = game.killLog || [];
    game.killLog.unshift({
      id: generateToken(4),
      type: "kill",
      killerId: killer.id,
      killerName: killer.name,
      victimId: victim.id,
      victimName: victim.name,
      scenarioTitle: usedScenario.title,
      timestamp: now,
      method
    });

    const alivePlayers = game.players.filter(p => p.alive);
    if (alivePlayers.length <= 1 || killer.targetId === killer.id) {
      game.status = "finished";
      game.finishedAt = now;
      const topKiller = [...game.players].sort((a, b) => (b.kills?.length || 0) - (a.kills?.length || 0))[0];
      game.winner = {
        survivorId: killer.id,
        survivorName: killer.name,
        survivorAvatar: killer.avatar,
        survivorPhotoUrl: killer.photoUrl,
        survivorKills: killer.kills.length,
        topKillerId: topKiller?.id,
        topKillerName: topKiller?.name,
        topKillerPhotoUrl: topKiller?.photoUrl,
        topKillerKills: topKiller?.kills?.length || 0
      };
    }

    saveState();
    broadcastEvent("game_updated", { event: "kill", killerName: killer.name, victimName: victim.name });

    if (state.commConfig.autoSendOnKill && state.commConfig.preferredChannel === "sms_external") {
      const newTarget = game.players.find(p => p.id === killer.targetId);
      if (killer.phone && game.status === "active") {
        sendExternalSms(killer.phone, buildPlayerMessage(killer, newTarget, "new_target"), killer.name).catch(console.error);
      }
      if (victim.phone) {
        sendExternalSms(victim.phone, buildPlayerMessage(victim, null, "eliminated"), victim.name).catch(console.error);
      }
    }
  }

  app.post("/api/player/declare-kill", async (req, res) => {
    try {
      const { token, victimPin } = req.body || {};
      const g = state.game;
      if (!g || g.status !== "active") {
        return res.status(400).json({ error: "La partie n'est pas active." });
      }
      const killer = g.players.find(p => p.token === token);
      if (!killer) return res.status(404).json({ error: "Joueur introuvable." });
      const victim = g.players.find(p => p.id === killer.targetId);
      if (!victim) return res.status(400).json({ error: "Cible introuvable." });

      if (g.settings.killValidationMode === "pin") {
        if (String(victim.pin).trim() !== String(victimPin || "").trim()) {
          const errMsg = killer.lang === "en"
            ? `Incorrect Autopsy Code for ${victim.name}! Ask ${victim.name} for the 4-digit code shown on their screen.`
            : `Code d'Autopsie de ${victim.name} incorrect ! Demande à ${victim.name} son code à 4 chiffres affiché sur son écran.`;
          return res.status(400).json({ error: errMsg });
        }
      }

      await executeKill(g, killer, victim, "killer_declared");
      return res.json({ ok: true, dossier: formatPlayerDossier(killer, g) });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/player/confirm-own-death", async (req, res) => {
    try {
      const { token } = req.body || {};
      const g = state.game;
      if (!g || g.status !== "active") {
        return res.status(400).json({ error: "La partie n'est pas active." });
      }
      const victim = g.players.find(p => p.token === token);
      if (!victim || !victim.alive) return res.status(400).json({ error: "Tu es déjà éliminé(e)." });
      const killer = g.players.find(p => p.alive && p.targetId === victim.id);
      if (!killer) return res.status(400).json({ error: "Aucun chasseur actif trouvé pour toi." });

      await executeKill(g, killer, victim, "victim_confirmed");
      return res.json({ ok: true, dossier: formatPlayerDossier(victim, g) });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/player/counter-attack", async (req, res) => {
    try {
      const { token, role } = req.body || {};
      const g = state.game;
      if (!g || g.status !== "active") {
        return res.status(400).json({ error: "La partie n'est pas active." });
      }
      const rule = g.settings.counterAttackRule;
      if (rule === "none") {
        return res.status(400).json({ error: "La règle de contre-attaque est désactivée pour cette partie." });
      }

      const caller = g.players.find(p => p.token === token);
      if (!caller || !caller.alive) return res.status(400).json({ error: "Joueur invalide ou déjà éliminé." });

      let hunter = caller;
      let target = g.players.find(p => p.id === caller.targetId);
      if (role === "target_unmasked_hunter") {
        target = caller;
        hunter = g.players.find(p => p.alive && p.targetId === caller.id);
      }
      if (!hunter || !target) {
        return res.status(400).json({ error: "Impossible d'identifier le duo chasseur/cible." });
      }

      const now = new Date().toISOString();
      const usedIds = new Set(g.players.map(p => p.scenario?.id).filter(Boolean));

      if (rule === "option_a") {
        const oldScenario = hunter.scenario;
        hunter.scenarioHistory = hunter.scenarioHistory || [];
        if (oldScenario) hunter.scenarioHistory.push({ ...oldScenario, replacedAt: now, reason: "Contre-attaque Option A (Mission grillée)" });
        hunter.scenario = pickRandomScenario(state.scenarios, usedIds, g.settings.difficultyFilter);

        g.killLog = g.killLog || [];
        g.killLog.unshift({
          id: generateToken(4),
          type: "counter_attack_a",
          killerName: hunter.name,
          victimName: target.name,
          scenarioTitle: `Mission grillée -> Nouveau scénario attribué à ${hunter.name}`,
          timestamp: now
        });
        saveState();
        broadcastEvent("game_updated", { event: "counter_attack", hunterName: hunter.name });
        return res.json({
          ok: true,
          message: caller.lang === "en"
            ? `Counter-Attack Option A confirmed! A new secret mission has been assigned to ${hunter.name}.`
            : `Contre-attaque Option A validée ! Une nouvelle mission secrète a été attribuée à ${hunter.name}.`,
          dossier: formatPlayerDossier(caller, g)
        });
      }

      if (rule === "option_b_immunity") {
        target.immunityUntil = Date.now() + 15 * 60 * 1000;
        const oldScenario = hunter.scenario;
        if (oldScenario) {
          hunter.scenarioHistory = hunter.scenarioHistory || [];
          hunter.scenarioHistory.push({ ...oldScenario, replacedAt: now, reason: "Contre-attaque Option B (Immunité 15m)" });
        }
        hunter.scenario = pickRandomScenario(state.scenarios, usedIds, g.settings.difficultyFilter);

        g.killLog = g.killLog || [];
        g.killLog.unshift({
          id: generateToken(4),
          type: "counter_attack_b_immunity",
          killerName: hunter.name,
          victimName: target.name,
          scenarioTitle: `${target.name} a démasqué ${hunter.name} (15 min d'immunité + nouveau scénario)`,
          timestamp: now
        });
        saveState();
        broadcastEvent("game_updated", { event: "counter_attack", hunterName: hunter.name });
        return res.json({
          ok: true,
          message: caller.lang === "en"
            ? `Counter-Attack Option B! ${target.name} gets 15 minutes of immunity and ${hunter.name}'s mission was changed.`
            : `Contre-attaque Option B ! ${target.name} obtient 15 minutes d'immunité et ${hunter.name} change de mission.`,
          dossier: formatPlayerDossier(caller, g)
        });
      }

      if (rule === "option_b_elimination") {
        const hunterOfHunter = g.players.find(p => p.alive && p.targetId === hunter.id);
        if (hunterOfHunter && hunterOfHunter.id !== hunter.id) {
          await executeKill(g, hunterOfHunter, hunter, "counter_attack_b_elimination");
        }
        return res.json({
          ok: true,
          message: caller.lang === "en"
            ? `Fatal Counter-Attack! The unmasked assassin (${hunter.name}) has been eliminated!`
            : `Contre-attaque punitive fatale ! L'assassin démasqué (${hunter.name}) est éliminé !`,
          dossier: formatPlayerDossier(caller, g)
        });
      }
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  // --- Admin API ---
  app.get("/api/admin/state", requireAdmin, (req, res) => {
    res.json({
      publicUrl: PUBLIC_URL,
      scenarios: state.scenarios,
      contacts: state.contacts,
      commConfig: state.commConfig,
      commLogs: state.commLogs.slice(0, 50),
      game: state.game,
      history: state.history.slice(0, 10)
    });
  });

  app.post("/api/admin/comm/check-brevo", requireAdmin, async (req, res) => {
    try {
      const apiKey = (req.body?.brevoApiKey || state.commConfig.brevoApiKey || "").trim();
      if (!apiKey) {
        return res.status(400).json({ error: "Veuillez saisir une clé API Brevo (xkeysib-...)." });
      }
      const resp = await fetch("https://api.brevo.com/v3/account", {
        headers: {
          "accept": "application/json",
          "api-key": apiKey
        }
      });
      const data = await resp.json().catch(() => ({}));
      if (resp.ok) {
        const smsPlan = (data.plan || []).find(p => p.type === "sms");
        return res.json({
          ok: true,
          email: data.email,
          companyName: data.companyName,
          smsCredits: smsPlan ? smsPlan.credits : "0 (Aucun pack SMS prépayé détecté)",
          plan: data.plan
        });
      }

      // If 403 on /v3/account, the user created a scoped API key without "account" permission.
      // Let's check if the key is authorized for Transactional SMS (/v3/transactionalSMS/statistics/reports)
      if (resp.status === 403) {
        const smsCheck = await fetch("https://api.brevo.com/v3/transactionalSMS/statistics/reports", {
          headers: {
            "accept": "application/json",
            "api-key": apiKey
          }
        });
        if (smsCheck.ok) {
          return res.json({
            ok: true,
            email: "Clé API restreinte (Permissions SMS Transactionnels actives ✅)",
            companyName: "Brevo SMS",
            smsCredits: "Clé valide (permissions lecture compte désactivées, mais SMS actif !)"
          });
        }
        const smsErr = await smsCheck.json().catch(() => ({}));
        return res.status(400).json({
          error: `Ta clé API Brevo a des permissions restreintes (${smsErr.message || data.message}). Dans Brevo > SMTP & API > Clés API, génère une clé API SANS restreindre les permissions (ou coche "SMS Transactionnels" + "Compte").`
        });
      }

      return res.status(400).json({ error: `Clé Brevo invalide (${resp.status}) : ${data.message || "Vérifie ta clé API v3"}` });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/admin/comm/test-sms", requireAdmin, async (req, res) => {
    try {
      const { phone, message, brevoApiKey, brevoSender, provider } = req.body || {};
      if (brevoApiKey !== undefined && String(brevoApiKey).trim()) {
        state.commConfig.brevoApiKey = String(brevoApiKey).trim();
      }
      if (brevoSender !== undefined && String(brevoSender).trim()) {
        state.commConfig.brevoSender = String(brevoSender).trim();
      }
      saveState();

      const testMsg = message || `🎯 [TEST KILLER] Ton service d'envoi SMS (${provider || state.commConfig.externalProvider || "Brevo"}) pour Le Cercle des Assassins est 100% opérationnel ! (${PUBLIC_URL})`;
      const log = await sendExternalSms(phone, testMsg, "Test Admin MJ", provider || state.commConfig.externalProvider);
      return res.json({ ok: true, log, commLogs: state.commLogs.slice(0, 50) });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  // Create Game (in 'lobby' Pre-Validation mode or direct 'active' mode)
  app.post("/api/admin/game/generate", requireAdmin, async (req, res) => {
    try {
      const {
        name = "Soirée Cercle des Assassins",
        players = [],
        counterAttackRule = "option_a",
        killValidationMode = "pin",
        difficultyFilter = "all",
        mode = "active" // 'lobby' | 'active'
      } = req.body || {};

      if (state.game && state.game.players?.length > 0) {
        state.history.unshift({
          id: state.game.id,
          name: state.game.name,
          createdAt: state.game.createdAt,
          finishedAt: state.game.finishedAt || new Date().toISOString(),
          totalPlayers: state.game.players.length,
          winner: state.game.winner,
          killLog: state.game.killLog || []
        });
        state.history = state.history.slice(0, 15);
      }

      state.game = createGame({
        name,
        players,
        scenariosCatalog: state.scenarios,
        counterAttackRule,
        killValidationMode,
        difficultyFilter,
        mode
      });

      saveState();
      broadcastEvent("game_updated", { event: "new_game", name, mode });

      if (state.commConfig.autoSendOnStart && state.commConfig.preferredChannel === "sms_external") {
        for (const p of state.game.players) {
          if (p.phone) {
            if (mode === "lobby") {
              sendExternalSms(p.phone, buildPlayerMessage(p, null, "invite"), p.name).catch(console.error);
            } else {
              const t = state.game.players.find(x => x.id === p.targetId);
              sendExternalSms(p.phone, buildPlayerMessage(p, t, "start"), p.name).catch(console.error);
            }
          }
        }
      }

      return res.json({ ok: true, game: state.game });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  // Launch active circle from Lobby using only confirmed ('accepted') participants!
  app.post("/api/admin/game/launch-lobby", requireAdmin, async (req, res) => {
    try {
      const g = state.game;
      if (!g || g.status !== "lobby") {
        return res.status(400).json({ error: "Aucune partie en phase de prévalidation." });
      }
      const { includePending = false, sendStartSms = false } = req.body || {};
      launchFromLobby(g, state.scenarios, { includePending });
      saveState();
      broadcastEvent("game_updated", { event: "lobby_launched", playersCount: g.players.length });

      if (sendStartSms || (state.commConfig.autoSendOnStart && state.commConfig.preferredChannel === "sms_external")) {
        for (const p of g.players) {
          if (p.phone) {
            const t = g.players.find(x => x.id === p.targetId);
            sendExternalSms(p.phone, buildPlayerMessage(p, t, "start"), p.name).catch(console.error);
          }
        }
      }

      return res.json({ ok: true, game: g });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/admin/game/settings", requireAdmin, (req, res) => {
    if (!state.game) return res.status(404).json({ error: "Aucune partie en cours." });
    const { name, counterAttackRule, killValidationMode, difficultyFilter, status } = req.body || {};
    if (name) state.game.name = name;
    if (counterAttackRule) state.game.settings.counterAttackRule = counterAttackRule;
    if (killValidationMode) state.game.settings.killValidationMode = killValidationMode;
    if (difficultyFilter) state.game.settings.difficultyFilter = difficultyFilter;
    if (status) {
      state.game.status = status;
      if (status === "active" && !state.game.startedAt) state.game.startedAt = new Date().toISOString();
    }
    saveState();
    broadcastEvent("game_updated", { event: "settings_updated" });
    return res.json({ ok: true, game: state.game });
  });

  app.post("/api/admin/player/replace-scenario", requireAdmin, async (req, res) => {
    const g = state.game;
    if (!g) return res.status(404).json({ error: "Aucune partie en cours." });
    const { playerId, mode = "random", scenarioId, customTitle, customTitle_en, customDescription, customDescription_en, customDifficulty, customCategory, customTip, notifyExternal = false } = req.body || {};

    const player = g.players.find(p => p.id === playerId);
    if (!player) return res.status(404).json({ error: "Joueur introuvable." });

    const now = new Date().toISOString();
    if (player.scenario) {
      player.scenarioHistory = player.scenarioHistory || [];
      player.scenarioHistory.push({
        ...player.scenario,
        replacedAt: now,
        reason: "Remplacé par le Maître du Jeu"
      });
    }

    let newScenario = null;
    if (mode === "custom") {
      if (!customDescription) return res.status(400).json({ error: "La description du scénario personnalisé est requise." });
      newScenario = {
        id: `custom-${generateToken(3)}`,
        title: customTitle || "Mission Spéciale MJ",
        title_en: customTitle_en || customTitle || "Special GM Mission",
        category: customCategory || "Spécial MJ",
        category_en: "GM Special",
        difficulty: customDifficulty || "Moyen",
        difficulty_en: customDifficulty === "Facile" ? "Easy" : customDifficulty === "Difficile" ? "Hard" : "Medium",
        description: customDescription,
        description_en: customDescription_en || customDescription,
        tip: customTip || "Mission conçue sur-mesure par le Maître du Jeu.",
        tip_en: customTip || "Custom mission crafted by the Game Master."
      };
    } else if (mode === "select" && scenarioId) {
      const found = state.scenarios.find(s => s.id === scenarioId);
      if (!found) return res.status(404).json({ error: "Scénario introuvable dans le catalogue." });
      newScenario = { ...found };
    } else {
      const usedIds = new Set(g.players.map(p => p.scenario?.id).filter(Boolean));
      if (player.scenario?.id) usedIds.add(player.scenario.id);
      newScenario = pickRandomScenario(state.scenarios, usedIds, g.settings.difficultyFilter);
    }

    player.scenario = newScenario;

    g.killLog = g.killLog || [];
    g.killLog.unshift({
      id: generateToken(4),
      type: "scenario_replaced",
      killerId: player.id,
      killerName: player.name,
      scenarioTitle: `Nouveau scénario assigné à ${player.name} : ${newScenario.title}`,
      timestamp: now
    });

    g.announcements = g.announcements || [];
    g.announcements.unshift({
      id: generateToken(4),
      targetPlayerId: player.id,
      text: `🔄 Le Maître du Jeu a mis à jour ta mission secrète : "${newScenario.title}" !`,
      text_en: `🔄 The Game Master updated your secret mission: "${newScenario.title_en || newScenario.title}"!`,
      timestamp: now
    });

    saveState();
    broadcastEvent("game_updated", { event: "scenario_replaced", playerId: player.id, playerName: player.name });

    const target = g.players.find(p => p.id === player.targetId);
    const preparedMsg = buildPlayerMessage(player, target, "scenario_change");

    if ((notifyExternal || state.commConfig.autoSendOnScenarioChange) && player.phone && state.commConfig.preferredChannel === "sms_external") {
      try {
        await sendExternalSms(player.phone, preparedMsg, player.name);
      } catch (err) {
        return res.json({ ok: true, game: g, player, preparedMessage: preparedMsg, smsWarning: err.message });
      }
    }

    return res.json({ ok: true, game: g, player, preparedMessage: preparedMsg });
  });

  app.post("/api/admin/game/force-kill", requireAdmin, async (req, res) => {
    try {
      const { killerId } = req.body || {};
      const g = state.game;
      if (!g) return res.status(404).json({ error: "Aucune partie en cours." });
      const killer = g.players.find(p => p.id === killerId);
      if (!killer) return res.status(404).json({ error: "Chasseur introuvable." });
      const victim = g.players.find(p => p.id === killer.targetId);
      if (!victim) return res.status(400).json({ error: "Cible introuvable." });

      await executeKill(g, killer, victim, "gm_force");
      return res.json({ ok: true, game: g });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/admin/game/undo", requireAdmin, (req, res) => {
    const g = state.game;
    if (!g || !g.undoStack || g.undoStack.length === 0) {
      return res.status(400).json({ error: "Aucune action précédente à annuler." });
    }
    const previous = JSON.parse(g.undoStack.pop());
    g.players = previous.players;
    g.status = previous.status;
    g.winner = previous.winner;
    g.killLog = previous.killLog;
    saveState();
    broadcastEvent("game_updated", { event: "undo" });
    return res.json({ ok: true, game: g });
  });

  // Add a player either to the Pre-Validation Lobby OR mid-game into the active circle!
  app.post("/api/admin/game/add-player", requireAdmin, (req, res) => {
    const g = state.game;
    if (!g) return res.status(404).json({ error: "Aucune partie en cours." });
    const { name, phone, lang = "fr", rsvpStatus } = req.body || {};
    if (!name || !String(name).trim()) return res.status(400).json({ error: "Le nom du joueur est requis." });

    const idx = g.players.length;

    if (g.status === "lobby") {
      const newInvitee = {
        id: `p-${idx + 1}-${generateToken(3)}`,
        circleOrder: idx + 1,
        name: String(name).trim(),
        phone: normalizePhone(phone || ""),
        avatar: AVATARS[idx % AVATARS.length],
        photoUrl: generateDefaultPhoto(String(name).trim(), idx),
        hasCustomPhoto: false,
        lang: lang === "en" ? "en" : "fr",
        rsvpStatus: rsvpStatus || "pending",
        rsvpUpdatedAt: null,
        onboarded: false,
        pin: generatePin(),
        token: generateToken(6),
        alive: false,
        targetId: null,
        scenario: null,
        scenarioHistory: [],
        kills: [],
        killedBy: null,
        immunityUntil: null
      };
      g.players.push(newInvitee);
      saveState();
      broadcastEvent("game_updated", { event: "invitee_added", playerName: newInvitee.name });
      return res.json({ ok: true, game: g, newPlayer: newInvitee });
    }

    const alivePlayers = g.players.filter(p => p.alive);
    if (alivePlayers.length === 0) return res.status(400).json({ error: "Aucun joueur en vie pour insérer dans la boucle." });

    const usedIds = new Set(g.players.map(p => p.scenario?.id).filter(Boolean));
    const scenario = pickRandomScenario(state.scenarios, usedIds, g.settings.difficultyFilter);

    const predecessor = alivePlayers[alivePlayers.length - 1];
    const oldTargetId = predecessor.targetId;

    const newPlayer = {
      id: `p-${idx + 1}-${generateToken(3)}`,
      circleOrder: idx + 1,
      name: String(name).trim(),
      phone: normalizePhone(phone || ""),
      avatar: AVATARS[idx % AVATARS.length],
      photoUrl: generateDefaultPhoto(String(name).trim(), idx),
      hasCustomPhoto: false,
      lang: lang === "en" ? "en" : "fr",
      rsvpStatus: "accepted",
      onboarded: false,
      pin: generatePin(),
      token: generateToken(6),
      alive: true,
      targetId: oldTargetId,
      scenario,
      scenarioHistory: [],
      kills: [],
      killedBy: null,
      immunityUntil: null
    };

    predecessor.targetId = newPlayer.id;
    g.players.push(newPlayer);
    if (g.status === "finished" && alivePlayers.length >= 1) {
      g.status = "active";
      g.winner = null;
    }

    saveState();
    broadcastEvent("game_updated", { event: "player_added", playerName: newPlayer.name });
    return res.json({ ok: true, game: g, newPlayer });
  });

  app.post("/api/admin/player/update", requireAdmin, (req, res) => {
    const g = state.game;
    if (!g) return res.status(404).json({ error: "Aucune partie en cours." });
    const { playerId, name, phone, pin, lang, photoUrl, rsvpStatus } = req.body || {};
    const player = g.players.find(p => p.id === playerId);
    if (!player) return res.status(404).json({ error: "Joueur introuvable." });

    if (name !== undefined && String(name).trim()) player.name = String(name).trim();
    if (phone !== undefined) player.phone = normalizePhone(phone);
    if (pin !== undefined && String(pin).trim()) player.pin = String(pin).trim();
    if (lang === "fr" || lang === "en") player.lang = lang;
    if (rsvpStatus === "accepted" || rsvpStatus === "declined" || rsvpStatus === "pending") {
      player.rsvpStatus = rsvpStatus;
      player.rsvpUpdatedAt = new Date().toISOString();
    }
    if (photoUrl && String(photoUrl).startsWith("data:image/")) {
      player.photoUrl = photoUrl;
      player.hasCustomPhoto = true;
    }

    saveState();
    broadcastEvent("game_updated", { event: "player_updated", playerId });
    return res.json({ ok: true, game: g, player });
  });

  app.post("/api/admin/comm/config", requireAdmin, (req, res) => {
    state.commConfig = {
      ...state.commConfig,
      ...(req.body || {})
    };
    saveState();
    return res.json({ ok: true, commConfig: state.commConfig });
  });

  app.post("/api/admin/comm/announce", requireAdmin, async (req, res) => {
    const { targetPlayerId = "all", text, text_en, sendExternal = false } = req.body || {};
    if (!text || !String(text).trim()) return res.status(400).json({ error: "Le message ne peut pas être vide." });

    if (state.game) {
      state.game.announcements = state.game.announcements || [];
      state.game.announcements.unshift({
        id: generateToken(4),
        targetPlayerId,
        text: String(text).trim(),
        text_en: String(text_en || text).trim(),
        timestamp: new Date().toISOString()
      });
      saveState();
      broadcastEvent("announcement", { targetPlayerId, text: String(text).trim(), text_en: String(text_en || text).trim() });
    }

    const results = [];
    if (sendExternal && state.game) {
      const recipients = targetPlayerId === "all"
        ? state.game.players.filter(p => (state.game.status === "lobby" || p.alive) && p.phone)
        : state.game.players.filter(p => p.id === targetPlayerId && p.phone);

      for (const p of recipients) {
        try {
          const msg = buildPlayerMessage(p, null, "custom", p.lang === "en" ? (text_en || text) : text);
          const r = await sendExternalSms(p.phone, msg, p.name);
          results.push({ player: p.name, ok: true, detail: r.detail });
        } catch (err) {
          results.push({ player: p.name, ok: false, error: err.message });
        }
      }
    }

    return res.json({ ok: true, game: state.game, externalResults: results });
  });

  app.post("/api/admin/comm/send-external", requireAdmin, async (req, res) => {
    try {
      const { playerId, phone, message, playerName } = req.body || {};
      let targetPhone = phone;
      let targetName = playerName || "Joueur";

      if (playerId && state.game) {
        const p = state.game.players.find(x => x.id === playerId);
        if (p) {
          targetPhone = p.phone;
          targetName = p.name;
        }
      }
      const entry = await sendExternalSms(targetPhone, message, targetName);
      return res.json({ ok: true, log: entry, commLogs: state.commLogs.slice(0, 50) });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/admin/contacts/save", requireAdmin, (req, res) => {
    const { contacts = [], merge = true } = req.body || {};
    const incoming = contacts
      .map(c => ({
        id: c.id || `ct-${generateToken(4)}`,
        name: String(c.name || "").trim(),
        phone: normalizePhone(c.phone || ""),
        email: String(c.email || "").trim(),
        photoUrl: c.photoUrl || "",
        source: c.source || "Google Contacts"
      }))
      .filter(c => c.name.length > 0);

    if (!merge) {
      state.contacts = incoming;
    } else {
      const byKey = new Map();
      for (const existing of state.contacts) {
        const key = `${existing.name.toLowerCase()}|${existing.phone}`;
        byKey.set(key, existing);
      }
      for (const item of incoming) {
        const key = `${item.name.toLowerCase()}|${item.phone}`;
        byKey.set(key, item);
      }
      state.contacts = Array.from(byKey.values()).sort((a, b) => a.name.localeCompare(b.name, "fr"));
    }

    saveState();
    return res.json({ ok: true, contacts: state.contacts });
  });

  app.delete("/api/admin/contacts/:id", requireAdmin, (req, res) => {
    if (req.params.id === "all") {
      state.contacts = [];
    } else {
      state.contacts = state.contacts.filter(c => c.id !== req.params.id);
    }
    saveState();
    return res.json({ ok: true, contacts: state.contacts });
  });

  app.post("/api/admin/scenarios/add", requireAdmin, (req, res) => {
    const { title, title_en, category, difficulty, description, description_en, tip, tip_en } = req.body || {};
    if (!title || !description) {
      return res.status(400).json({ error: "Titre et description requis." });
    }
    const newSc = {
      id: `sc-${Date.now().toString(36)}`,
      title: String(title).trim(),
      title_en: String(title_en || title).trim(),
      category: category || "Piège Verbal",
      category_en: category === "Objet & Poison" ? "Object & Poison" : category === "Action & Geste" ? "Action & Gesture" : category === "Mise en Situation" ? "Situational" : "Verbal Trap",
      difficulty: difficulty || "Moyen",
      difficulty_en: difficulty === "Facile" ? "Easy" : difficulty === "Difficile" ? "Hard" : "Medium",
      description: String(description).trim(),
      description_en: String(description_en || description).trim(),
      tip: String(tip || "Sois discret et naturel !").trim(),
      tip_en: String(tip_en || tip || "Be discreet and act natural!").trim()
    };
    state.scenarios.unshift(newSc);
    saveState();
    return res.json({ ok: true, scenario: newSc, scenarios: state.scenarios });
  });

  app.delete("/api/admin/scenarios/:id", requireAdmin, (req, res) => {
    state.scenarios = state.scenarios.filter(s => s.id !== req.params.id);
    saveState();
    return res.json({ ok: true, scenarios: state.scenarios });
  });

  app.get("/p/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  return { app, getState: () => state };
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const PUBLIC_URL = (process.env.PUBLIC_URL || "http://localhost:3000").replace(/\/$/, "");
  const { app } = createApp();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎯 Le Cercle des Assassins (Jeu du Killer) démarré sur le port ${PORT} (${PUBLIC_URL})`);
  });
}

module.exports = { createApp };
