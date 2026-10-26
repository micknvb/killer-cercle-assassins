// Frontend Application - Le Cercle des Assassins (Bilingual FR/EN, Photos, Brevo SMS & Google Contacts)

const PORTRAIT_THEMES = [
  { bg1: "#881337", bg2: "#1e1b4b", accent: "#f43f5e", hat: "#0f172a" },
  { bg1: "#1e3a8a", bg2: "#0f172a", accent: "#38bdf8", hat: "#1e293b" },
  { bg1: "#064e3b", bg2: "#0f172a", accent: "#10b981", hat: "#111827" },
  { bg1: "#78350f", bg2: "#18181b", accent: "#f59e0b", hat: "#1c1917" },
  { bg1: "#4c1d95", bg2: "#090d16", accent: "#a855f7", hat: "#1e1b4b" },
  { bg1: "#701a75", bg2: "#0f172a", accent: "#ec4899", hat: "#1f2937" },
  { bg1: "#155e75", bg2: "#090d16", accent: "#06b6d4", hat: "#0f172a" },
  { bg1: "#3f6212", bg2: "#0f172a", accent: "#84cc16", hat: "#18181b" }
];

function generateClientDefaultPhoto(name = "Agent", idx = 0) {
  const theme = PORTRAIT_THEMES[idx % PORTRAIT_THEMES.length];
  const parts = String(name || "Agent").trim().split(/\s+/).filter(Boolean);
  const initials = (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || "AG").slice(0, 2)).toUpperCase().replace(/[<>&"']/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${theme.bg1}"/><stop offset="100%" stop-color="${theme.bg2}"/></linearGradient></defs>
    <rect width="160" height="160" rx="80" fill="url(#g)"/>
    <circle cx="80" cy="80" r="74" fill="none" stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.45" stroke-dasharray="6 4"/>
    <path d="M26 155 C32 114, 128 114, 134 155 Z" fill="${theme.hat}"/>
    <polygon points="64,120 80,144 96,120" fill="${theme.accent}" opacity="0.85"/>
    <circle cx="80" cy="70" r="26" fill="#cbd5e1"/>
    <ellipse cx="80" cy="50" rx="38" ry="8" fill="${theme.hat}"/>
    <path d="M54 50 C56 26, 104 26, 106 50 Z" fill="${theme.hat}"/>
    <rect x="54" y="45" width="52" height="4" fill="${theme.accent}"/>
    <rect x="59" y="61" width="18" height="10" rx="3" fill="#090b10" stroke="${theme.accent}" stroke-width="1.5"/>
    <rect x="83" y="61" width="18" height="10" rx="3" fill="#090b10" stroke="${theme.accent}" stroke-width="1.5"/>
    <line x1="77" y1="65" x2="83" y2="65" stroke="${theme.accent}" stroke-width="1.5"/>
    <rect x="52" y="130" width="56" height="20" rx="10" fill="#090b10" stroke="${theme.accent}" stroke-width="1.5"/>
    <text x="80" y="144" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="12">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Bilingual Dictionary (FR / EN)
const I18N = {
  fr: {
    brandTitle: "LE CERCLE DES ASSASSINS",
    brandSub: "Jeu du Killer • Grandeur Nature",
    navRules: "Règles",
    navPlayer: "Mon Contrat",
    navBoard: "Survivants",
    navAdmin: "MJ",
    heroBadge: "🕵️ Dossier Déclassifié • Règles Officielles",
    heroTitle: "Bienvenue dans <span>Le Cercle des Assassins</span>",
    heroDesc: "Un jeu d'infiltration, de bluff et de psychologie grandeur nature. Chaque joueur reçoit en secret la photo et le prénom d'une <strong>Cible</strong> ainsi qu'un <strong>Scénario de Meurtre</strong>. Éliminez votre cible sans vous faire démasquer pour récupérer son contrat… jusqu'à ce qu'il n'en reste qu'un !",
    btnAccessContract: "🕵️ Accéder à mon Contrat Secret",
    btnViewSurvivors: "🏆 Survivants",
    btnGmSpace: "👑 Maître du Jeu",
    howItWorksTitle: "🎯 Comment fonctionne une partie ? (En 4 étapes)",
    closedLoopBadge: "Mécanique du Cercle Fermé",
    step1Title: "1. Le Contrat Secret",
    step1Desc: "Chaque joueur reçoit sur son téléphone un lien personnel secret avec la <strong>photo de sa Cible</strong> et un <strong>Scénario de Meurtre</strong> précis (mot à faire dire, geste à provoquer, objet à donner...).",
    step2Title: "2. Le Piège en Douceur",
    step2Desc: "Tout au long de la soirée, tendez votre piège naturellement. Dès que votre cible réalise l'action ou prononce le mot demandé, murmurez-lui : <em>« Tu es mort(e) ! »</em>.",
    step3Title: "3. Le Code d'Autopsie",
    step3Desc: "La victime vous communique son <strong>Code d'Autopsie à 4 chiffres</strong> (ou clique sur <em>« J'ai été éliminé »</em> sur son téléphone) pour valider officiellement le meurtre.",
    step4Title: "4. L'Héritage du Contrat",
    step4Desc: "<strong>La boucle se resserre !</strong> Vous récupérez instantanément la <strong>Cible</strong> ET le <strong>Scénario de Meurtre</strong> que détenait votre victime. Le dernier survivant gagne !",
    counterRuleTitle: "🛡️ Règle de Contre-Attaque (Démasquage)",
    counterRuleIntro: "Que se passe-t-il si une cible comprend qu'un joueur essaie de la piéger et <strong>devine sa mission à voix haute</strong> avant de tomber dans le piège ?",
    activeModeLabel: "Mode actif sur la partie actuelle :",
    fairPlayTitle: "⚖️ Les 5 Règles d'Or du Fair-Play",
    noGameTitle: "Aucune partie n'est encore lancée",
    noGameDesc: "Le Maître du Jeu prépare actuellement le Cercle des Assassins. Dès que la partie sera générée, tu pourras te connecter ici ou cliquer sur ton lien personnel reçu par SMS / WhatsApp !",
    refreshBtn: "🔄 Actualiser",
    loginTitle: "🔐 Accès Dossier Agent Secret",
    loginDesc: "Sélectionne ton prénom et entre ton <strong>Code PIN à 4 chiffres</strong> (ou ouvre directement le lien personnel envoyé par SMS / WhatsApp).",
    whoAreYou: "Qui es-tu ?",
    chooseName: "-- Choisis ton prénom --",
    yourSecretPin: "Ton Code PIN secret (4 chiffres)",
    openContractBtn: "🕵️ Ouvrir mon Contrat Secret",
    onboardTitle: "🕵️ Bienvenue Agent ! Configure ton profil",
    onboardSub: "Avant de découvrir ta cible secrète, choisis ta langue et ajoute ta photo de profil pour que les autres agents puissent t'identifier :",
    chooseLangLabel: "1. Choisis ta langue / Select your language",
    choosePhotoLabel: "2. Ta Photo d'Agent (Selfie ou Portrait par défaut)",
    uploadSelfieBtn: "📸 Prendre un Selfie / Choisir une photo",
    orPickPortrait: "Ou choisis un portrait d'agent par défaut :",
    saveProfileBtn: "✅ Valider mon profil et voir ma Cible Secrète",
    gameFinishedTitle: "PARTIE TERMINÉE !",
    survivorUltimate: "Survivant Ultime",
    serialKiller: "Sérial Killer",
    eliminatedBadge: "AGENT ÉLIMINÉ AU COMBAT",
    killedByText: "Tu as été éliminé(e) par",
    withMissionText: "grâce à la mission",
    silenceRule: "🤫 <strong>Règle d'or :</strong> Garde le silence sur les missions en cours ! Il reste",
    survivorsHunting: "survivant(s) en chasse.",
    activeContractTitle: "🎯 Ton Contrat Actif",
    hideScreenBtn: "🙈 Camoufler (Anti-Espion)",
    revealScreenBtn: "👁️ Révéler ma Cible & Mission",
    antiSpyHint: "🔒 Mode Anti-Espion actif : touche <strong>« Révéler ma Cible & Mission »</strong> quand personne ne regarde ton écran.",
    yourTargetLabel: "TA CIBLE À ÉLIMINER",
    targetBadge: "CIBLE",
    targetImmuneBadge: "🛡️ Cible immunisée pendant encore",
    tipLabel: "💡 Astuce d'exécution :",
    succeededQuestion: "🗡️ Mission accomplie sur",
    victimPinPlaceholder: "Code d'Autopsie à 4 chiffres de ta victime...",
    validateKillBtn: "🗡️ Valider l'Élimination",
    pinExplain: "Dis <em>« Tu es mort(e) »</em> à ta cible : elle te donnera son Code d'Autopsie à 4 chiffres (ou pourra cliquer sur « J'ai été éliminé » sur son téléphone).",
    directKillBtn: "🗡️ J'ai éliminé ma cible ! (Récupérer son contrat)",
    myAutopsyCode: "🔐 Mon Code d'Autopsie :",
    showCode: "Afficher",
    iWasEliminatedBtn: "💀 J'ai été éliminé(e)",
    myMissionCompromisedBtn: "🛡️ Ma cible a grillé ma mission",
    iUnmaskedHunterBtn: "⚡ J'ai démasqué mon chasseur !",
    previousKillsTitle: "🔪 Mes Précédents Meurtres",
    noKillsYet: "Tu n'as encore éliminé personne dans cette partie. Ton tableau de chasse avec les photos de tes victimes s'affichera ici !",
    gmChannelTitle: "📡 Canal Maître du Jeu",
    noAnnouncements: "Aucune annonce pour le moment.",
    editProfileBtn: "📸 Photo / 🇬🇧 Langue",
    copySecretLinkBtn: "🔗 Lien secret",
    switchPlayerBtn: "🚪 Quitter",
    aliveBadge: "En Vie",
    deadBadge: "💀 Éliminé",
    agentsAliveLabel: "Agents encore en vie",
    murdersCommittedLabel: "Meurtres perpétrés",
    counterAttackRuleLabel: "Règle de Contre-Attaque",
    playersStatusTitle: "🕵️ Galerie des Agents (Sans révéler les cibles)",
    topKillersTitle: "🔪 Classement Sérial Killers"
  },
  en: {
    brandTitle: "CIRCLE OF ASSASSINS",
    brandSub: "Live Action Killer Game",
    navRules: "Rules",
    navPlayer: "My Contract",
    navBoard: "Survivors",
    navAdmin: "GM",
    heroBadge: "🕵️ Declassified Dossier • Official Rules",
    heroTitle: "Welcome to the <span>Circle of Assassins</span>",
    heroDesc: "A live-action game of stealth, bluff, and psychology. Every player secretly receives the photo and name of a <strong>Target</strong> along with a <strong>Murder Scenario</strong>. Eliminate your target without getting caught to inherit their contract… until only one survivor remains!",
    btnAccessContract: "🕵️ Open My Secret Contract",
    btnViewSurvivors: "🏆 Survivors",
    btnGmSpace: "👑 Game Master",
    howItWorksTitle: "🎯 How Does the Game Work? (In 4 Steps)",
    closedLoopBadge: "Closed Loop Mechanics",
    step1Title: "1. The Secret Contract",
    step1Desc: "Each player receives a personal secret link on their phone showing their <strong>Target's photo</strong> and a specific <strong>Murder Scenario</strong> (make them say a word, perform a gesture, take an object...).",
    step2Title: "2. Spring the Trap",
    step2Desc: "Throughout the event, set your trap naturally. As soon as your target performs the action or says the secret word, whisper to them: <em>'You are dead!'</em>.",
    step3Title: "3. The Autopsy Code",
    step3Desc: "Your victim gives you their <strong>4-digit Autopsy Code</strong> (or taps <em>'I was eliminated'</em> on their own phone) to officially confirm the kill.",
    step4Title: "4. Inherit the Contract",
    step4Desc: "<strong>The circle tightens!</strong> You immediately inherit the <strong>Target</strong> AND the <strong>Murder Scenario</strong> that belonged to your victim. The last survivor wins!",
    counterRuleTitle: "🛡️ Counter-Attack Rule (Unmasking)",
    counterRuleIntro: "What happens if a target realizes someone is trying to trap them and <strong>guesses their exact mission out loud</strong> before falling into the trap?",
    activeModeLabel: "Active rule for the current game:",
    fairPlayTitle: "⚖️ The 5 Golden Rules of Fair Play",
    noGameTitle: "No game has started yet",
    noGameDesc: "The Game Master is currently preparing the Circle of Assassins. As soon as the game starts, you can log in here or tap your personal link received via SMS / WhatsApp!",
    refreshBtn: "🔄 Refresh",
    loginTitle: "🔐 Secret Agent Dossier Login",
    loginDesc: "Select your name and enter your <strong>4-digit PIN code</strong> (or open the personal link sent via SMS / WhatsApp).",
    whoAreYou: "Who are you?",
    chooseName: "-- Select your name --",
    yourSecretPin: "Your 4-digit secret PIN",
    openContractBtn: "🕵️ Open My Secret Contract",
    onboardTitle: "🕵️ Welcome Agent! Set Up Your Profile",
    onboardSub: "Before revealing your secret target, choose your preferred language and add your profile photo so other agents can recognize you:",
    chooseLangLabel: "1. Select your language / Choisis ta langue",
    choosePhotoLabel: "2. Your Agent Photo (Selfie or Default Portrait)",
    uploadSelfieBtn: "📸 Take a Selfie / Upload Photo",
    orPickPortrait: "Or pick a default secret agent portrait:",
    saveProfileBtn: "✅ Save Profile & Reveal My Secret Target",
    gameFinishedTitle: "GAME OVER!",
    survivorUltimate: "Ultimate Survivor",
    serialKiller: "Serial Killer",
    eliminatedBadge: "KILLED IN ACTION",
    killedByText: "You were eliminated by",
    withMissionText: "using the mission",
    silenceRule: "🤫 <strong>Golden Rule:</strong> Keep all active missions secret! There are still",
    survivorsHunting: "survivor(s) hunting.",
    activeContractTitle: "🎯 Your Active Contract",
    hideScreenBtn: "🙈 Hide Screen (Anti-Spy)",
    revealScreenBtn: "👁️ Reveal My Target & Mission",
    antiSpyHint: "🔒 Anti-Spy Mode active: tap <strong>'Reveal My Target & Mission'</strong> when nobody is looking at your screen.",
    yourTargetLabel: "YOUR TARGET TO ELIMINATE",
    targetBadge: "TARGET",
    targetImmuneBadge: "🛡️ Target immune for another",
    tipLabel: "💡 Execution Tip:",
    succeededQuestion: "🗡️ Mission accomplished on",
    victimPinPlaceholder: "Your victim's 4-digit Autopsy Code...",
    validateKillBtn: "🗡️ Confirm Elimination",
    pinExplain: "Say <em>'You are dead'</em> to your target: they will give you their 4-digit Autopsy Code (or tap 'I was eliminated' on their own phone).",
    directKillBtn: "🗡️ I Eliminated My Target! (Claim Next Contract)",
    myAutopsyCode: "🔐 My Autopsy Code:",
    showCode: "Show",
    iWasEliminatedBtn: "💀 I was eliminated",
    myMissionCompromisedBtn: "🛡️ My target guessed my mission",
    iUnmaskedHunterBtn: "⚡ I unmasked my hunter!",
    previousKillsTitle: "🔪 My Previous Kills",
    noKillsYet: "You haven't eliminated anyone yet. Your trophy list with your victims' photos will appear here!",
    gmChannelTitle: "📡 Game Master Feed",
    noAnnouncements: "No announcements yet.",
    editProfileBtn: "📸 Photo / 🇬🇧 Lang",
    copySecretLinkBtn: "🔗 Secret Link",
    switchPlayerBtn: "🚪 Log out",
    aliveBadge: "Alive",
    deadBadge: "💀 Eliminated",
    agentsAliveLabel: "Agents still alive",
    murdersCommittedLabel: "Murders committed",
    counterAttackRuleLabel: "Counter-Attack Rule",
    playersStatusTitle: "🕵️ Agents Gallery (Targets hidden)",
    topKillersTitle: "🔪 Serial Killers Leaderboard"
  }
};

const state = {
  lang: localStorage.getItem("killer_lang") || "fr",
  currentView: "rules",
  adminSubTab: "live",
  publicSummary: null,
  playerToken: localStorage.getItem("killer_player_token") || "",
  playerDossier: null,
  showOnboardingEditor: false,
  tempOnboardPhoto: "",
  tempPortraitIdx: 0,
  isContractRevealed: false,
  isPinRevealed: false,
  adminToken: localStorage.getItem("killer_admin_token") || "",
  adminData: null,
  brevoCheckStatus: null,
  testSmsPhone: "",
  gmPlayerFilter: "alive",
  gmLobbyFilter: "all",
  includePendingOnLaunch: false,
  autoSmsOnLaunch: false,
  draftPlayers: [
    { name: "", phone: "" },
    { name: "", phone: "" },
    { name: "", phone: "" },
    { name: "", phone: "" }
  ],
  draftSettings: {
    name: "Soirée Cercle des Assassins",
    counterAttackRule: "option_a",
    killValidationMode: "pin",
    difficultyFilter: "all"
  },
  contactSearch: "",
  selectedContactIds: new Set(),
  sentQueueTracker: new Set(),
  scenarioSearch: "",
  scenarioCategoryFilter: "all"
};

function t(key) {
  return I18N[state.lang]?.[key] || I18N.fr[key] || key;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setLanguage(lang) {
  if (lang !== "fr" && lang !== "en") return;
  state.lang = lang;
  localStorage.setItem("killer_lang", lang);
  localStorage.setItem("killer_lang_manual", "1");
  document.documentElement.lang = lang;
  if (state.playerDossier?.player) {
    state.playerDossier.player.lang = lang;
  }
  updateTopbarLabels();
  renderApp();
  showToast(lang === "en" ? "🇬🇧 Language switched to English" : "🇫🇷 Langue passée en Français", "info");

  // Also persist language on player profile if logged in
  if (state.playerToken && state.playerDossier) {
    apiFetch("/api/player/profile", {
      method: "POST",
      body: JSON.stringify({ token: state.playerToken, lang, onboarded: state.playerDossier.player.onboarded })
    }).then(res => {
      state.playerDossier = res.dossier;
      renderApp();
    }).catch(() => {});
  }
}

function updateTopbarLabels() {
  document.getElementById("lang-btn-fr")?.classList.toggle("active", state.lang === "fr");
  document.getElementById("lang-btn-en")?.classList.toggle("active", state.lang === "en");
  const titleEl = document.getElementById("brand-title-text");
  const subEl = document.getElementById("brand-sub-text");
  if (titleEl) titleEl.textContent = t("brandTitle");
  if (subEl) subEl.textContent = t("brandSub");
  const rEl = document.getElementById("nav-label-rules");
  const pEl = document.getElementById("nav-label-player");
  const bEl = document.getElementById("nav-label-board");
  const aEl = document.getElementById("nav-label-admin");
  if (rEl) rEl.textContent = t("navRules");
  if (pEl) pEl.textContent = t("navPlayer");
  if (bEl) bEl.textContent = t("navBoard");
  if (aEl) aEl.textContent = t("navAdmin");
}

function showToast(msg, type = "info") {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = "toast";
  if (type === "success") el.style.borderLeftColor = "#10b981";
  if (type === "gold") el.style.borderLeftColor = "#f59e0b";
  el.innerHTML = msg;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 4200);
}

function formatTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(state.lang === "en" ? "en-GB" : "fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch (_) {
    return "";
  }
}

function difficultyBadge(sc) {
  if (!sc) return "";
  const rawDiff = sc.difficulty || "Moyen";
  const label = state.lang === "en" ? (sc.difficulty_en || (rawDiff === "Facile" ? "Easy" : rawDiff === "Difficile" ? "Hard" : "Medium")) : rawDiff;
  const cls = rawDiff === "Facile" ? "badge-easy" : rawDiff === "Difficile" ? "badge-hard" : "badge-medium";
  return `<span class="badge ${cls}">${escapeHtml(label)}</span>`;
}

function counterAttackLabel(rule) {
  if (state.lang === "en") {
    if (rule === "option_a") return "Option A — Mission Compromised (New scenario assigned to the assassin)";
    if (rule === "option_b_immunity") return "Option B (Immunity) — Unmasked assassin = 15 min immunity for target + new mission";
    if (rule === "option_b_elimination") return "Option B (Lethal) — Unmasked assassin = Immediate elimination of the assassin!";
    return "Disabled — No counter-attack rule";
  }
  if (rule === "option_a") return "Option A — Mission Grillée (Nouveau scénario attribué à l'assassin)";
  if (rule === "option_b_immunity") return "Option B (Immunité) — Assassin démasqué = 15 min d'immunité pour la cible + nouveau scénario";
  if (rule === "option_b_elimination") return "Option B (Mortelle) — Assassin démasqué = Élimination immédiate de l'assassin !";
  return "Désactivée — Aucune règle de contre-attaque";
}

// Client-side image resize & compression to 320x320 JPEG Data URI
function resizeImageFile(file, maxSize = 320) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        // Center crop square
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- API Helpers ---
async function apiFetch(url, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.adminToken) {
    headers["x-admin-token"] = state.adminToken;
  }
  const resp = await fetch(url, { ...options, headers });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data.error || `HTTP Error ${resp.status}`);
  }
  return data;
}

async function refreshData() {
  try {
    state.publicSummary = await apiFetch("/api/public/summary");
  } catch (e) {
    console.error(e);
  }
  if (state.playerToken) {
    try {
      state.playerDossier = await apiFetch(`/api/player/by-token/${encodeURIComponent(state.playerToken)}`);
      if (state.playerDossier?.player?.lang && !localStorage.getItem("killer_lang_manual")) {
        state.lang = state.playerDossier.player.lang;
        updateTopbarLabels();
      }
    } catch (_) {
      state.playerDossier = null;
    }
  }
  if (state.adminToken) {
    try {
      state.adminData = await apiFetch("/api/admin/state");
    } catch (_) {
      state.adminToken = "";
      localStorage.removeItem("killer_admin_token");
      state.adminData = null;
    }
  }
  renderApp();
}

function switchView(view) {
  state.currentView = view;
  document.querySelectorAll(".nav-tab").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.getElementById(`tab-${view}`);
  if (activeBtn) activeBtn.classList.add("active");
  renderApp();
}

// --- Communication Message Builders ---
function buildPlayerCustomMessage(player, game, template = "start", customText = "") {
  const baseUrl = (state.adminData?.publicUrl || state.publicSummary?.publicUrl || window.location.origin).replace(/\/$/, "");
  const link = `${baseUrl}/p/${player.token}`;
  const effectiveTemplate = (game?.status === "lobby" && template === "start") ? "invite" : template;
  const target = (game?.players || []).find(p => p.id === player.targetId);
  const isEn = player.lang === "en";
  const targetName = target ? target.name : (isEn ? "None" : "Aucune");
  const sc = player.scenario || {};
  const scTitle = isEn ? (sc.title_en || sc.title || "Secret Mission") : (sc.title || "Mission secrète");
  const scDesc = isEn ? (sc.description_en || sc.description || "") : (sc.description || "");

  if (isEn) {
    if (effectiveTemplate === "invite") {
      return `🕵️ *INVITATION — CIRCLE OF ASSASSINS* 🎯\nHi ${player.name}! We're preparing a live Killer Game for the party (${game?.name || "Circle of Assassins"}).\n\n👉 *Tap your personal link to:*\n1️⃣ Confirm if you're playing (Yes / No)\n2️⃣ Add your profile photo / selfie\n3️⃣ Read the game rules:\n${link}\n\n🔐 *(Personal PIN: ${player.pin})*`;
    }
    if (effectiveTemplate === "start") {
      return `🎯 *CIRCLE OF ASSASSINS* 🎯\nHi ${player.name}! The game has started.\n\n🕵️ *Your Target:* ${targetName}\n📜 *Mission (${scTitle}):* ${scDesc}\n🔐 *Your PIN / Autopsy Code:* ${player.pin}\n\n👉 *Open your secret dossier & target photo:*\n${link}`;
    }
    if (effectiveTemplate === "scenario_change") {
      return `🔄 *NEW SECRET MISSION*\nHi ${player.name}, the Game Master updated your scenario on *${targetName}*!\n\n🆕 *Mission (${scTitle}):* ${scDesc}\n\n👉 *Open your dossier:*\n${link}`;
    }
    return `📢 *GAME MASTER MESSAGE*\nHi ${player.name}: ${customText || "Update on the ongoing game!"}\n\n👉 *Your dossier:* ${link}`;
  }

  if (effectiveTemplate === "invite") {
    return `🕵️ *INVITATION — LE CERCLE DES ASSASSINS* 🎯\nSalut ${player.name} ! On prépare un Jeu du Killer grandeur nature pour la soirée (${game?.name || "Soirée Killer"}).\n\n👉 *Clique sur ton lien personnel pour :*\n1️⃣ Valider ta participation (Oui / Non)\n2️⃣ Ajouter ta photo de profil / selfie\n3️⃣ Découvrir les règles du jeu :\n${link}\n\n🔐 *(Ton Code PIN perso : ${player.pin})*`;
  }
  if (effectiveTemplate === "start") {
    return `🎯 *LE CERCLE DES ASSASSINS* 🎯\nSalut ${player.name} ! La partie commence.\n\n🕵️ *Ta Cible :* ${targetName}\n📜 *Mission (${scTitle}) :* ${scDesc}\n🔐 *Ton Code PIN / Autopsie :* ${player.pin}\n\n👉 *Ouvre ton dossier secret (avec la photo de ta cible) :*\n${link}`;
  }
  if (effectiveTemplate === "scenario_change") {
    return `🔄 *NOUVELLE MISSION SECRÈTE*\nSalut ${player.name}, le Maître du Jeu a remplacé ton scénario sur *${targetName}* !\n\n🆕 *Mission (${scTitle}) :* ${scDesc}\n\n👉 *Voir ton dossier :*\n${link}`;
  }
  return `📢 *MESSAGE DU MAÎTRE DU JEU*\nSalut ${player.name} : ${customText || "Mise à jour sur la partie en cours !"}\n\n👉 *Ton dossier :* ${link}`;
}

function getWhatsAppUrl(phone, text) {
  const cleaned = String(phone || "").replace(/[^\d]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}

function getSmsUri(phone, text) {
  const cleaned = String(phone || "").replace(/[^\d+]/g, "");
  return `sms:${cleaned}?body=${encodeURIComponent(text)}`;
}

// --- View 1: Règles & Principe Illustrés (Bilingual FR/EN) ---
function renderRulesView() {
  const g = state.publicSummary?.game;
  const activeCounterRule = g?.settings?.counterAttackRule || "option_a";
  const isEn = state.lang === "en";

  return `
    <section class="hero-banner">
      <div>
        <div class="hero-badge">${t("heroBadge")}</div>
        <h1 class="hero-title">${t("heroTitle")}</h1>
        <p class="hero-desc">${t("heroDesc")}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="switchView('player')">
            ${t("btnAccessContract")}
          </button>
          <button class="btn btn-ghost" onclick="switchView('board')">
            ${t("btnViewSurvivors")} (${g ? g.aliveCount + '/' + g.totalPlayers : '0'})
          </button>
          <button class="btn btn-ghost" onclick="switchView('admin')">
            ${t("btnGmSpace")}
          </button>
        </div>
      </div>
      <div class="hero-illustration">
        <svg viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="glowRed" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#e11d48" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#090b10" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="180" cy="140" r="125" fill="url(#glowRed)"/>
          <circle cx="180" cy="140" r="95" stroke="#e11d48" stroke-width="2.5" stroke-dasharray="7 6" opacity="0.75"/>
          <circle cx="180" cy="140" r="62" stroke="#f59e0b" stroke-width="1.5" opacity="0.4"/>
          <line x1="180" y1="60" x2="180" y2="220" stroke="#e11d48" stroke-width="1" opacity="0.35"/>
          <line x1="100" y1="140" x2="260" y2="140" stroke="#e11d48" stroke-width="1" opacity="0.35"/>
          <circle cx="180" cy="140" r="18" fill="#181e2c" stroke="#e11d48" stroke-width="2.5"/>
          <circle cx="180" cy="140" r="5" fill="#e11d48"/>
          <g transform="translate(180, 45)">
            <circle cx="0" cy="0" r="22" fill="#121621" stroke="#f59e0b" stroke-width="2.5"/>
            <text x="0" y="6" text-anchor="middle" fill="#fff" font-size="18">🕵️</text>
            <rect x="-34" y="-34" width="68" height="16" rx="8" fill="#f59e0b"/>
            <text x="0" y="-23" text-anchor="middle" fill="#090b10" font-size="9" font-weight="800">AGENT A</text>
          </g>
          <g transform="translate(275, 140)">
            <circle cx="0" cy="0" r="22" fill="#121621" stroke="#e11d48" stroke-width="2.5"/>
            <text x="0" y="6" text-anchor="middle" fill="#fff" font-size="18">🥷</text>
            <rect x="-34" y="26" width="68" height="16" rx="8" fill="#e11d48"/>
            <text x="0" y="37" text-anchor="middle" fill="#fff" font-size="9" font-weight="800">${isEn ? "TARGET B" : "CIBLE B"}</text>
          </g>
          <g transform="translate(180, 235)">
            <circle cx="0" cy="0" r="22" fill="#121621" stroke="#38bdf8" stroke-width="2.5"/>
            <text x="0" y="6" text-anchor="middle" fill="#fff" font-size="18">🎭</text>
            <rect x="-34" y="26" width="68" height="16" rx="8" fill="#38bdf8"/>
            <text x="0" y="37" text-anchor="middle" fill="#090b10" font-size="9" font-weight="800">AGENT C</text>
          </g>
          <g transform="translate(85, 140)">
            <circle cx="0" cy="0" r="22" fill="#121621" stroke="#10b981" stroke-width="2.5"/>
            <text x="0" y="6" text-anchor="middle" fill="#fff" font-size="18">🦊</text>
            <rect x="-34" y="26" width="68" height="16" rx="8" fill="#10b981"/>
            <text x="0" y="37" text-anchor="middle" fill="#090b10" font-size="9" font-weight="800">AGENT D</text>
          </g>
        </svg>
      </div>
    </section>

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">${t("howItWorksTitle")}</h2>
        <span class="badge badge-cat">${t("closedLoopBadge")}</span>
      </div>

      <div class="grid-4">
        <div class="rule-step-card">
          <div class="rule-step-svg">
            <svg width="110" height="80" viewBox="0 0 120 90" fill="none">
              <rect x="20" y="15" width="80" height="60" rx="8" fill="#181e2c" stroke="#f59e0b" stroke-width="2"/>
              <circle cx="45" cy="45" r="14" fill="#881337" stroke="#f43f5e" stroke-width="1.5"/>
              <line x1="66" y1="35" x2="90" y2="35" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
              <line x1="66" y1="47" x2="92" y2="47" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
              <line x1="66" y1="57" x2="82" y2="57" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div style="font-weight:800; color:var(--gold-light);">${t("step1Title")}</div>
          <p style="font-size:0.84rem; color:var(--text-muted);">${t("step1Desc")}</p>
        </div>

        <div class="rule-step-card">
          <div class="rule-step-svg">
            <svg width="110" height="80" viewBox="0 0 120 90" fill="none">
              <circle cx="42" cy="45" r="18" fill="#181e2c" stroke="#e11d48" stroke-width="2"/>
              <circle cx="82" cy="45" r="18" fill="#181e2c" stroke="#38bdf8" stroke-width="2"/>
              <path d="M55 38 C62 30, 65 30, 70 38" stroke="#f59e0b" stroke-width="2" fill="none"/>
              <text x="42" y="50" text-anchor="middle" font-size="15">🕵️</text>
              <text x="82" y="50" text-anchor="middle" font-size="15">🗣️</text>
            </svg>
          </div>
          <div style="font-weight:800; color:#fda4af;">${t("step2Title")}</div>
          <p style="font-size:0.84rem; color:var(--text-muted);">${t("step2Desc")}</p>
        </div>

        <div class="rule-step-card">
          <div class="rule-step-svg">
            <svg width="110" height="80" viewBox="0 0 120 90" fill="none">
              <rect x="28" y="22" width="64" height="46" rx="8" fill="#181e2c" stroke="#10b981" stroke-width="2"/>
              <text x="60" y="51" text-anchor="middle" fill="#10b981" font-family="monospace" font-weight="900" font-size="18">4 8 2 9</text>
            </svg>
          </div>
          <div style="font-weight:800; color:#6ee7b7;">${t("step3Title")}</div>
          <p style="font-size:0.84rem; color:var(--text-muted);">${t("step3Desc")}</p>
        </div>

        <div class="rule-step-card">
          <div class="rule-step-svg">
            <svg width="110" height="80" viewBox="0 0 120 90" fill="none">
              <circle cx="28" cy="48" r="14" fill="#181e2c" stroke="#f59e0b" stroke-width="2"/>
              <circle cx="60" cy="48" r="14" fill="#181e2c" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 3"/>
              <line x1="50" y1="38" x2="70" y2="58" stroke="#e11d48" stroke-width="2.5"/>
              <line x1="70" y1="38" x2="50" y2="58" stroke="#e11d48" stroke-width="2.5"/>
              <circle cx="92" cy="48" r="14" fill="#181e2c" stroke="#10b981" stroke-width="2"/>
              <path d="M35 32 Q60 10 86 32" stroke="#f59e0b" stroke-width="2.2" fill="none"/>
            </svg>
          </div>
          <div style="font-weight:800; color:#7dd3fc;">${t("step4Title")}</div>
          <p style="font-size:0.84rem; color:var(--text-muted);">${t("step4Desc")}</p>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card card-crimson">
        <div class="card-header">
          <h3 class="card-title">${t("counterRuleTitle")}</h3>
        </div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:0.85rem;">${t("counterRuleIntro")}</p>
        <div style="background:rgba(0,0,0,0.35); border:1px solid var(--border-crimson); border-radius:var(--radius-sm); padding:0.85rem; margin-bottom:0.85rem;">
          <div style="font-size:0.74rem; text-transform:uppercase; color:var(--gold); font-weight:700;">${t("activeModeLabel")}</div>
          <div style="font-size:0.96rem; font-weight:800; color:#fff; margin-top:0.2rem;">
            ${escapeHtml(counterAttackLabel(activeCounterRule))}
          </div>
        </div>
        ${isEn ? `
          <ul style="font-size:0.84rem; color:var(--text-muted); padding-left:1.2rem; display:flex; flex-direction:column; gap:0.4rem;">
            <li><strong>Option A (Classic):</strong> The assassin's mission is burned! They tap <em>'My target guessed my mission'</em> and receive a brand new scenario for the same target.</li>
            <li><strong>Option B (Punitive):</strong> The unmasked assassin suffers a penalty: either their target gets <strong>15 minutes of immunity</strong>, or the assassin is eliminated on the spot!</li>
            <li><strong>No random guessing:</strong> You cannot randomly shout 'You're trying to kill me!' — you must state the exact trap action!</li>
          </ul>
        ` : `
          <ul style="font-size:0.84rem; color:var(--text-muted); padding-left:1.2rem; display:flex; flex-direction:column; gap:0.4rem;">
            <li><strong>Option A (Classique) :</strong> La mission de l'assassin est grillée ! Il clique sur <em>« Ma cible a grillé ma mission »</em> et reçoit immédiatement un nouveau scénario pour la même cible.</li>
            <li><strong>Option B (Punitive) :</strong> L'assassin démasqué subit une pénalité : soit sa cible gagne <strong>15 minutes d'immunité totale</strong>, soit l'assassin est lui-même éliminé sur-le-champ !</li>
            <li><strong>Attention aux fausses accusations :</strong> Il est interdit de crier « Tu essaies de me tuer ! » au hasard. Il faut énoncer l'action précise du piège !</li>
          </ul>
        `}
      </div>

      <div class="card card-gold">
        <div class="card-header">
          <h3 class="card-title">${t("fairPlayTitle")}</h3>
        </div>
        ${isEn ? `
          <ol style="font-size:0.88rem; color:var(--text-muted); padding-left:1.2rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong style="color:#fff;">Total Secrecy:</strong> Never show your phone screen or reveal your target or mission, even after you are eliminated!</li>
            <li><strong style="color:#fff;">No Physical Force:</strong> Every kill must be achieved through wit, conversation, or trickery. Never force an item into someone's hand.</li>
            <li><strong style="color:#fff;">Dead Men Tell No Tales:</strong> Eliminated players must never warn their former target about who is now hunting them!</li>
            <li><strong style="color:#fff;">Game Master Joker:</strong> If a mission is truly impossible given the situation, ask the Game Master to replace it on the fly.</li>
            <li><strong style="color:#fff;">Two Trophies:</strong> At the end, two titles are awarded: <strong>🏆 Ultimate Survivor</strong> (last alive) and <strong>🔪 Serial Killer</strong> (most kills).</li>
          </ol>
        ` : `
          <ol style="font-size:0.88rem; color:var(--text-muted); padding-left:1.2rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong style="color:#fff;">Secret absolu :</strong> Ne montrez jamais votre écran et ne révélez jamais votre cible ni votre mission, même après votre élimination !</li>
            <li><strong style="color:#fff;">Zéro contrainte physique :</strong> Tout meurtre doit être obtenu par la ruse, la discussion ou la complicité. On ne force jamais quelqu'un à prendre un objet.</li>
            <li><strong style="color:#fff;">Les morts ne parlent pas :</strong> Un joueur éliminé ne doit jamais prévenir sa propre cible de qui est son nouveau chasseur !</li>
            <li><strong style="color:#fff;">Joker du Maître du Jeu :</strong> Si votre scénario s'avère impossible selon le contexte, le Maître du Jeu peut le remplacer à la volée en 1 clic.</li>
            <li><strong style="color:#fff;">Double Récompense :</strong> À la fin, deux titres sont décernés : <strong>🏆 Le Survivant Ultime</strong> et <strong>🔪 Le Sérial Killer</strong>.</li>
          </ol>
        `}
      </div>
    </div>
  `;
}

// --- View 2: Espace Joueur ("Mon Contrat" + Onboarding Photo & Langue) ---
function renderPlayerView() {
  const g = state.publicSummary?.game;
  if (!g) {
    return `
      <div class="card" style="text-align:center; padding:2.5rem 1.25rem;">
        <div style="font-size:3rem; margin-bottom:0.75rem;">🕵️</div>
        <h2 style="margin-bottom:0.5rem;">${t("noGameTitle")}</h2>
        <p style="color:var(--text-muted); max-width:520px; margin:0 auto 1.25rem;">${t("noGameDesc")}</p>
        <button class="btn btn-ghost" onclick="refreshData()">${t("refreshBtn")}</button>
      </div>
    `;
  }

  if (!state.playerDossier) {
    const optionsHtml = (g.playersList || [])
      .map(p => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.avatar)} ${escapeHtml(p.name)} ${p.alive ? "" : `(${t("deadBadge")})`}</option>`)
      .join("");

    return `
      <div class="card card-crimson" style="max-width:500px; margin:1rem auto;">
        <div class="card-header">
          <h2 class="card-title">${t("loginTitle")}</h2>
          <span class="contract-stamp">TOP SECRET</span>
        </div>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1.1rem;">${t("loginDesc")}</p>
        <form onsubmit="handlePlayerLogin(event)">
          <div class="form-group">
            <label class="form-label">${t("whoAreYou")}</label>
            <select id="login-player-id" class="select" required>
              <option value="">${t("chooseName")}</option>
              ${optionsHtml}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">${t("yourSecretPin")}</label>
            <input id="login-player-pin" type="password" inputmode="numeric" maxlength="6" class="input" placeholder="Ex: 4829" required />
          </div>
          <button type="submit" class="btn btn-primary btn-block">${t("openContractBtn")}</button>
        </form>
      </div>
    `;
  }

  const d = state.playerDossier;
  const p = d.player;
  const isEn = state.lang === "en";

  // PRE-VALIDATION LOBBY SCREEN (Before game starts)
  if (d.gameStatus === "lobby") {
    const currentPreview = state.tempOnboardPhoto || p.photoUrl || generateClientDefaultPhoto(p.name, state.tempPortraitIdx);
    const portraitsHtml = PORTRAIT_THEMES.map((_, idx) => {
      const pUrl = generateClientDefaultPhoto(p.name, idx);
      return `
        <div class="portrait-option ${state.tempPortraitIdx === idx && !state.tempOnboardPhoto ? 'selected' : ''}" onclick="selectDefaultPortraitAndSave(${idx})">
          <img src="${pUrl}" alt="Portrait ${idx + 1}" class="avatar-photo" />
        </div>
      `;
    }).join("");

    const rsvpStatus = p.rsvpStatus || "pending";
    const statusBannerHtml = rsvpStatus === "accepted"
      ? `<div style="background:rgba(16,185,129,0.16); border:1px solid rgba(16,185,129,0.5); border-radius:var(--radius-sm); padding:0.85rem; text-align:center; margin-bottom:1rem;">
           <div style="font-size:1.05rem; font-weight:800; color:#6ee7b7;">
             ${isEn ? "✅ Your participation is CONFIRMED!" : "✅ Ta participation est CONFIRMÉE !"}
           </div>
           <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.2rem;">
             ${isEn
               ? "Keep this page open or save your link: as soon as the Game Master starts the party, your secret Target and Mission will appear right here!"
               : "Garde cette page ouverte ou conserve ton lien : dès que le Maître du Jeu lancera la soirée, ta Cible et ta Mission secrète s'afficheront ici !"}
           </div>
         </div>`
      : rsvpStatus === "declined"
      ? `<div style="background:rgba(225,29,72,0.15); border:1px solid rgba(225,29,72,0.5); border-radius:var(--radius-sm); padding:0.85rem; text-align:center; margin-bottom:1rem;">
           <div style="font-size:1.02rem; font-weight:800; color:#fda4af;">
             ${isEn ? "❌ You indicated that you are NOT playing" : "❌ Tu as indiqué ne pas souhaiter participer"}
           </div>
           <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">
             ${isEn ? "Changed your mind? Tap 'Yes, I'm playing!' below before the game starts." : "Tu as changé d'avis ? Clique sur « Oui, je participe ! » ci-dessous avant le lancement."}
           </div>
         </div>`
      : `<div style="background:rgba(245,158,11,0.14); border:1px solid rgba(245,158,11,0.45); border-radius:var(--radius-sm); padding:0.85rem; text-align:center; margin-bottom:1rem;">
           <div style="font-size:1.02rem; font-weight:800; color:var(--gold-light);">
             ${isEn ? "⏳ Waiting for your confirmation!" : "⏳ En attente de ta confirmation !"}
           </div>
           <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">
             ${isEn ? "Confirm below whether you want to join the Circle of Assassins tonight." : "Indique ci-dessous si tu souhaites participer au Cercle des Assassins ce soir."}
           </div>
         </div>`;

    const acceptedPeers = d.acceptedPeers || [];
    const peersHtml = acceptedPeers.length === 0
      ? `<p style="color:var(--text-muted); font-size:0.84rem; text-align:center;">${isEn ? "Be the first to confirm your participation!" : "Sois le premier à confirmer ta participation !"}</p>`
      : `<div style="display:flex; flex-wrap:wrap; gap:0.65rem; justify-content:center;">
          ${acceptedPeers.map((ap, i) => `
            <div style="display:flex; align-items:center; gap:0.45rem; background:var(--bg-elevated); border:1px solid var(--border-subtle); padding:0.35rem 0.65rem; border-radius:999px;">
              <img src="${ap.photoUrl || generateClientDefaultPhoto(ap.name, i)}" class="avatar-photo-sm" alt="${escapeHtml(ap.name)}" />
              <span style="font-size:0.82rem; font-weight:700;">${escapeHtml(ap.name)}</span>
            </div>
          `).join("")}
        </div>`;

    return `
      <div class="card card-gold" style="max-width:620px; margin:0.5rem auto;">
        <div class="card-header">
          <div>
            <span class="badge badge-cat">${isEn ? "PRE-VALIDATION & INVITATION" : "PRÉVALIDATION & INVITATION"}</span>
            <h2 class="card-title" style="margin-top:0.35rem;">
              🕵️ ${isEn ? `Welcome ${escapeHtml(p.name)}!` : `Bienvenue ${escapeHtml(p.name)} !`}
            </h2>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="logoutPlayer()">${t("switchPlayerBtn")}</button>
        </div>

        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem;">
          ${isEn
            ? `You are invited to <strong>${escapeHtml(d.gameName)}</strong>. Confirm your participation, upload your photo so your hunter can recognize you, and check out the rules before the game begins!`
            : `Tu es invité(e) à la soirée <strong>${escapeHtml(d.gameName)}</strong>. Valide ta participation, ajoute ta photo pour le jeu et découvre les règles avant le coup d'envoi !`}
        </p>

        <!-- Step 1: Language -->
        <div class="form-group">
          <label class="form-label">${t("chooseLangLabel")}</label>
          <div class="grid-2">
            <button type="button" class="btn ${state.lang === 'fr' ? 'btn-primary' : 'btn-ghost'}" onclick="setLanguage('fr')">
              🇫🇷 Français
            </button>
            <button type="button" class="btn ${state.lang === 'en' ? 'btn-primary' : 'btn-ghost'}" onclick="setLanguage('en')">
              🇬🇧 English
            </button>
          </div>
        </div>

        <!-- Step 2: RSVP Participation -->
        <div class="form-group" style="background:rgba(0,0,0,0.36); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-gold);">
          <label class="form-label" style="text-align:center; font-size:0.86rem; color:var(--gold-light); margin-bottom:0.65rem;">
            ${isEn ? "2. ARE YOU PLAYING TONIGHT?" : "2. PARTICIPES-TU AU JEU DU KILLER CE SOIR ?"}
          </label>
          ${statusBannerHtml}
          <div class="grid-2">
            <button type="button" class="btn ${rsvpStatus === 'accepted' ? 'btn-emerald' : 'btn-primary'}" style="padding:0.85rem; font-size:0.96rem;" onclick="handlePlayerRsvp('accepted')">
              ${isEn ? "✅ Yes, I'm playing!" : "✅ Oui, je participe !"}
            </button>
            <button type="button" class="btn ${rsvpStatus === 'declined' ? 'btn-primary' : 'btn-ghost'}" style="padding:0.85rem; font-size:0.92rem;" onclick="handlePlayerRsvp('declined')">
              ${isEn ? "❌ No, I won't play" : "❌ Non, je ne joue pas"}
            </button>
          </div>
        </div>

        <!-- Step 3: Profile Photo / Selfie -->
        <div class="form-group" style="text-align:center; background:rgba(0,0,0,0.32); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          <label class="form-label" style="margin-bottom:0.65rem;">
            ${isEn ? "3. Your Agent Photo (Selfie or Default Portrait)" : "3. Ta Photo d'Agent (Selfie ou Portrait par défaut)"}
          </label>
          <img id="onboard-photo-preview" src="${currentPreview}" alt="${escapeHtml(p.name)}" class="avatar-photo-lg" style="margin-bottom:0.75rem;" />
          <div>
            <label class="btn btn-gold btn-block" style="cursor:pointer; margin-bottom:0.75rem;">
              ${t("uploadSelfieBtn")}
              <input type="file" accept="image/*" style="display:none;" onchange="handleLobbyPhotoUpload(event)" />
            </label>
          </div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.35rem;">${t("orPickPortrait")}</div>
          <div class="portrait-grid">
            ${portraitsHtml}
          </div>
        </div>

        <!-- Step 4: Quick Rules Summary + Link to Full Illustrated Rules -->
        <div style="background:rgba(225,29,72,0.08); border:1px solid var(--border-crimson); border-radius:var(--radius-md); padding:1rem; margin-bottom:1rem;">
          <div style="font-weight:800; color:#fda4af; margin-bottom:0.45rem;">
            📜 ${isEn ? "Quick Rules Summary" : "Rappel Express des Règles du Jeu"}
          </div>
          ${isEn ? `
            <ul style="font-size:0.84rem; color:var(--text-muted); padding-left:1.15rem; display:flex; flex-direction:column; gap:0.35rem; margin-bottom:0.75rem;">
              <li><strong>Secret Target & Mission:</strong> When the game starts, you'll discover the photo of your Target and a funny action/word to make them do.</li>
              <li><strong>Elimination & Inheritance:</strong> Once you trap your target, whisper <em>"You're dead"</em>, get their 4-digit code, and inherit their target!</li>
              <li><strong>Total Secrecy:</strong> Never tell anyone who your target is or what your mission is.</li>
            </ul>
          ` : `
            <ul style="font-size:0.84rem; color:var(--text-muted); padding-left:1.15rem; display:flex; flex-direction:column; gap:0.35rem; margin-bottom:0.75rem;">
              <li><strong>Cible & Mission Secrète :</strong> Au lancement, tu découvriras sur cette page la photo de ta Cible et une action ou un mot à lui faire dire.</li>
              <li><strong>Élimination & Héritage :</strong> Dès que ta cible tombe dans ton piège, dis-lui <em>« Tu es mort(e) »</em>, récupère son code à 4 chiffres et hérite de son contrat !</li>
              <li><strong>Secret Absolu :</strong> Ne révèle jamais ta cible ni ta mission à personne.</li>
            </ul>
          `}
          <button type="button" class="btn btn-ghost btn-block btn-sm" onclick="switchView('rules')">
            📖 ${isEn ? "Read Full Illustrated Rules" : "Voir les Règles Illustrées Complètes"}
          </button>
        </div>

        <!-- Live Confirmed Participants Gallery -->
        <div style="background:rgba(0,0,0,0.28); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.9rem;">
          <div style="font-weight:800; font-size:0.88rem; text-align:center; color:var(--gold-light); margin-bottom:0.65rem;">
            🟢 ${isEn ? `Confirmed Agents for Tonight (${d.rsvpCounts?.accepted || 0})` : `Agents déjà confirmés pour ce soir (${d.rsvpCounts?.accepted || 0})`}
          </div>
          ${peersHtml}
        </div>
      </div>
    `;
  }

  // First-connection onboarding screen (if !p.onboarded or user clicked "Photo / Langue")
  if (!p.onboarded || state.showOnboardingEditor) {
    const currentPreview = state.tempOnboardPhoto || p.photoUrl || generateClientDefaultPhoto(p.name, state.tempPortraitIdx);
    const portraitsHtml = PORTRAIT_THEMES.map((_, idx) => {
      const pUrl = generateClientDefaultPhoto(p.name, idx);
      return `
        <div class="portrait-option ${state.tempPortraitIdx === idx && !state.tempOnboardPhoto ? 'selected' : ''}" onclick="selectDefaultPortrait(${idx})">
          <img src="${pUrl}" alt="Portrait ${idx + 1}" class="avatar-photo" />
        </div>
      `;
    }).join("");

    return `
      <div class="card card-gold" style="max-width:540px; margin:0.5rem auto;">
        <div class="card-header">
          <h2 class="card-title">${t("onboardTitle")}</h2>
          <span class="badge badge-medium">${escapeHtml(p.name)}</span>
        </div>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.1rem;">
          ${t("onboardSub")}
        </p>

        <div class="form-group">
          <label class="form-label">${t("chooseLangLabel")}</label>
          <div class="grid-2">
            <button type="button" class="btn ${state.lang === 'fr' ? 'btn-primary' : 'btn-ghost'}" onclick="setLanguage('fr')">
              🇫🇷 Français (French)
            </button>
            <button type="button" class="btn ${state.lang === 'en' ? 'btn-primary' : 'btn-ghost'}" onclick="setLanguage('en')">
              🇬🇧 English (Anglais)
            </button>
          </div>
        </div>

        <div class="form-group" style="text-align:center; background:rgba(0,0,0,0.32); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          <label class="form-label" style="margin-bottom:0.65rem;">${t("choosePhotoLabel")}</label>
          <img id="onboard-photo-preview" src="${currentPreview}" alt="${escapeHtml(p.name)}" class="avatar-photo-lg" style="margin-bottom:0.75rem;" />
          <div>
            <label class="btn btn-gold btn-block" style="cursor:pointer; margin-bottom:0.75rem;">
              ${t("uploadSelfieBtn")}
              <input type="file" accept="image/*" style="display:none;" onchange="handlePlayerPhotoFile(event)" />
            </label>
          </div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.35rem;">${t("orPickPortrait")}</div>
          <div class="portrait-grid">
            ${portraitsHtml}
          </div>
        </div>

        <button class="btn btn-primary btn-block" onclick="savePlayerOnboarding()">
          ${t("saveProfileBtn")}
        </button>
      </div>
    `;
  }

  const blurClass = state.isContractRevealed ? "" : "blurred";

  let finishedBanner = "";
  if (d.gameStatus === "finished" && d.winner) {
    finishedBanner = `
      <div class="card card-gold" style="text-align:center; margin-bottom:1.25rem;">
        <div style="font-size:2.4rem;">🏆</div>
        <h2 style="font-size:1.5rem; color:var(--gold-light);">${t("gameFinishedTitle")}</h2>
        <div style="display:flex; justify-content:center; align-items:center; gap:0.75rem; margin:0.65rem 0; flex-wrap:wrap;">
          ${d.winner.survivorPhotoUrl ? `<img src="${d.winner.survivorPhotoUrl}" class="avatar-photo" alt="Winner" />` : ""}
          <p style="font-size:1rem;">
            ${t("survivorUltimate")} : <strong>${escapeHtml(d.winner.survivorName)}</strong> (${d.winner.survivorKills} kills)
            • ${t("serialKiller")} : <strong>${escapeHtml(d.winner.topKillerName)}</strong> (${d.winner.topKillerKills} kills)
          </p>
        </div>
      </div>
    `;
  }

  let statusCardHtml = "";
  if (!p.alive) {
    const kb = p.killedBy;
    const kbTitle = kb ? (isEn ? (kb.scenarioTitle_en || kb.scenarioTitle) : kb.scenarioTitle) : "";
    const kbDesc = kb ? (isEn ? (kb.scenarioDescription_en || kb.scenarioDescription) : kb.scenarioDescription) : "";

    statusCardHtml = `
      <div class="card card-crimson" style="text-align:center; padding:1.75rem 1rem;">
        <span class="badge badge-dead" style="margin-bottom:0.65rem;">${t("eliminatedBadge")}</span>
        <h2 style="font-size:1.5rem; margin-bottom:0.6rem;">💀 R.I.P. ${escapeHtml(p.name)}</h2>
        ${kb ? `
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; margin-bottom:0.85rem;">
            ${kb.killerPhotoUrl ? `<img src="${kb.killerPhotoUrl}" class="avatar-photo-lg" style="border-color:var(--crimson);" alt="${escapeHtml(kb.killerName)}" />` : ""}
            <p style="color:var(--text-muted); max-width:500px; margin:0 auto;">
              ${t("killedByText")} <strong style="color:#fff;">${escapeHtml(kb.killerName)}</strong> (${formatTime(kb.timestamp)}) ${t("withMissionText")} :<br/>
              <em style="color:var(--gold-light);">« ${escapeHtml(kbTitle)} — ${escapeHtml(kbDesc || "")} »</em>
            </p>
          </div>
        ` : ""}
        <div style="background:rgba(0,0,0,0.35); padding:0.75rem; border-radius:var(--radius-sm); display:inline-block; font-size:0.86rem;">
          ${t("silenceRule")} <strong>${d.aliveCount} ${t("survivorsHunting")}</strong>
        </div>
      </div>
    `;
  } else if (p.target && p.scenario) {
    const targetImmunityActive = p.target.immunityUntil && p.target.immunityUntil > Date.now();
    const targetImmunityMins = targetImmunityActive ? Math.ceil((p.target.immunityUntil - Date.now()) / 60000) : 0;

    const scTitle = isEn ? (p.scenario.title_en || p.scenario.title) : p.scenario.title;
    const scCat = isEn ? (p.scenario.category_en || p.scenario.category) : p.scenario.category;
    const scDesc = isEn ? (p.scenario.description_en || p.scenario.description) : p.scenario.description;
    const scTip = isEn ? (p.scenario.tip_en || p.scenario.tip) : p.scenario.tip;
    const targetPhoto = p.target.photoUrl || generateClientDefaultPhoto(p.target.name, 1);

    statusCardHtml = `
      <div class="card card-crimson">
        <div class="card-header">
          <div>
            <span class="contract-stamp">CONFIDENTIEL</span>
            <h2 class="card-title" style="margin-top:0.35rem;">${t("activeContractTitle")}</h2>
          </div>
          <button class="btn ${state.isContractRevealed ? 'btn-ghost' : 'btn-gold'}" onclick="toggleContractReveal()">
            ${state.isContractRevealed ? t("hideScreenBtn") : t("revealScreenBtn")}
          </button>
        </div>

        ${!state.isContractRevealed ? `
          <div style="text-align:center; padding:0.35rem 0 0.5rem; color:var(--gold-light); font-size:0.84rem;">
            ${t("antiSpyHint")}
          </div>
        ` : ""}

        <div class="secret-content ${blurClass}">
          <div class="target-showcase">
            <div style="font-size:0.74rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-muted);">${t("yourTargetLabel")}</div>
            <div class="target-mugshot-container">
              <div class="target-crosshair-ring"></div>
              <img src="${targetPhoto}" alt="${escapeHtml(p.target.name)}" class="target-mugshot-img" />
              <span class="target-crosshair-badge">🎯 ${t("targetBadge")}</span>
            </div>
            <div class="target-name">${escapeHtml(p.target.name)}</div>
            ${targetImmunityActive ? `
              <div style="margin-top:0.5rem;">
                <span class="badge badge-hard">${t("targetImmuneBadge")} ${targetImmunityMins} min</span>
              </div>
            ` : ""}
          </div>

          <div class="scenario-box">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.45rem;">
              <span class="badge badge-cat">${escapeHtml(scCat || "Mission")}</span>
              ${difficultyBadge(p.scenario)}
            </div>
            <div class="scenario-title">« ${escapeHtml(scTitle)} »</div>
            <div class="scenario-desc">${escapeHtml(scDesc)}</div>
            ${scTip ? `
              <div class="scenario-tip">
                <strong>${t("tipLabel")}</strong> ${escapeHtml(scTip)}
              </div>
            ` : ""}
          </div>
        </div>

        <!-- Kill Validation Section -->
        <div style="margin-top:1.15rem; padding-top:1.1rem; border-top:1px solid var(--border-subtle);">
          <h3 style="font-size:1rem; margin-bottom:0.55rem;">${t("succeededQuestion")} ${state.isContractRevealed ? escapeHtml(p.target.name) : "..."} ?</h3>
          ${d.settings?.killValidationMode === "pin" ? `
            <form onsubmit="handleDeclareKill(event)" style="display:flex; gap:0.55rem; flex-wrap:wrap;">
              <input id="victim-pin-input" type="text" inputmode="numeric" maxlength="6" class="input" style="flex:1; min-width:190px;" placeholder="${t("victimPinPlaceholder")}" required />
              <button type="submit" class="btn btn-primary">${t("validateKillBtn")}</button>
            </form>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.4rem;">${t("pinExplain")}</div>
          ` : `
            <button class="btn btn-primary btn-block" onclick="handleDeclareKillDirect()">${t("directKillBtn")}</button>
          `}
        </div>

        <!-- Counter-Attack & Self-Elimination Controls -->
        <div style="margin-top:1rem; padding-top:0.9rem; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
            <button class="btn btn-ghost btn-sm" onclick="togglePinReveal()">
              ${t("myAutopsyCode")} <strong>${state.isPinRevealed ? escapeHtml(p.pin) : `•••• (${t("showCode")})`}</strong>
            </button>
            <button class="btn btn-ghost btn-sm" style="border-color:rgba(225,29,72,0.4); color:#fda4af;" onclick="handleConfirmOwnDeath()">
              ${t("iWasEliminatedBtn")}
            </button>
          </div>

          ${d.settings?.counterAttackRule && d.settings.counterAttackRule !== "none" ? `
            <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
              <button class="btn btn-ghost btn-sm" style="border-color:var(--border-gold); color:var(--gold-light);" onclick="handleCounterAttack('assassin_compromised')">
                ${t("myMissionCompromisedBtn")}
              </button>
              <button class="btn btn-ghost btn-sm" style="border-color:var(--border-gold); color:var(--gold-light);" onclick="handleCounterAttack('target_unmasked_hunter')">
                ${t("iUnmaskedHunterBtn")}
              </button>
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }

  // Previous Kills with Victim Photos
  const kills = p.kills || [];
  const killsHtml = kills.length === 0
    ? `<p style="color:var(--text-muted); font-size:0.88rem;">${t("noKillsYet")}</p>`
    : kills.map((k, idx) => {
        const kTitle = isEn ? (k.scenarioTitle_en || k.scenarioTitle) : k.scenarioTitle;
        const kDesc = isEn ? (k.scenarioDescription_en || k.scenarioDescription) : k.scenarioDescription;
        const vPhoto = k.victimPhotoUrl || generateClientDefaultPhoto(k.victimName, idx);
        return `
          <div style="background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.75rem; margin-bottom:0.55rem; display:flex; justify-content:space-between; align-items:center; gap:0.65rem; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:0.65rem;">
              <img src="${vPhoto}" alt="${escapeHtml(k.victimName)}" class="avatar-photo" />
              <div>
                <div style="font-weight:700; color:#fff;">
                  🔪 #${idx + 1} : ${escapeHtml(k.victimName)}
                </div>
                <div style="font-size:0.8rem; color:var(--gold-light);">
                  « ${escapeHtml(kTitle)} » ${kDesc ? `— ${escapeHtml(kDesc)}` : ""}
                </div>
              </div>
            </div>
            <span class="badge badge-dead">${formatTime(k.timestamp)}</span>
          </div>
        `;
      }).join("");

  const announcementsHtml = (d.announcements || []).map(a => `
    <div style="padding:0.6rem 0.8rem; background:rgba(255,255,255,0.03); border-left:3px solid var(--crimson); border-radius:4px; margin-bottom:0.45rem; font-size:0.86rem;">
      <div style="color:var(--text-muted); font-size:0.74rem;">📢 GM • ${formatTime(a.timestamp)}</div>
      <div style="color:#fff; margin-top:0.12rem;">${escapeHtml(isEn ? (a.text_en || a.text) : a.text)}</div>
    </div>
  `).join("");

  const myPhoto = p.photoUrl || generateClientDefaultPhoto(p.name, 0);

  return `
    ${finishedBanner}
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.65rem; margin-bottom:0.9rem;">
      <div style="display:flex; align-items:center; gap:0.65rem;">
        <img src="${myPhoto}" alt="${escapeHtml(p.name)}" class="avatar-photo" style="border-color:var(--emerald);" />
        <div>
          <div style="font-weight:800; font-size:1.1rem;">${escapeHtml(p.name)}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">
            ${d.aliveCount}/${d.totalPlayers} ${isEn ? "alive" : "en vie"} • ${kills.length} kill(s)
          </div>
        </div>
      </div>
      <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
        <button class="btn btn-ghost btn-sm" onclick="openOnboardingEditor()">${t("editProfileBtn")}</button>
        <button class="btn btn-ghost btn-sm" onclick="copyText('${escapeHtml(p.link)}', '${isEn ? 'Secret link copied!' : 'Lien secret copié !'}')">${t("copySecretLinkBtn")}</button>
        <button class="btn btn-ghost btn-sm" onclick="logoutPlayer()">${t("switchPlayerBtn")}</button>
      </div>
    </div>

    ${statusCardHtml}

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${t("previousKillsTitle")} (${kills.length})</h3>
        </div>
        ${killsHtml}
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${t("gmChannelTitle")}</h3>
        </div>
        ${announcementsHtml || `<p style="color:var(--text-muted); font-size:0.88rem;">${t("noAnnouncements")}</p>`}
      </div>
    </div>
  `;
}

// --- View 3: Survivants & Podium Public (With Photos & Lobby support) ---
function renderBoardView() {
  const g = state.publicSummary?.game;
  const isEn = state.lang === "en";
  if (!g) {
    return `
      <div class="card" style="text-align:center; padding:2.5rem;">
        <h2>${t("noGameTitle")}</h2>
      </div>
    `;
  }

  if (g.status === "lobby") {
    const counts = g.rsvpCounts || { accepted: 0, pending: 0, declined: 0 };
    const lobbyPlayersHtml = (g.playersList || []).map((p, idx) => {
      const photo = p.photoUrl || generateClientDefaultPhoto(p.name, idx);
      const badge = p.rsvpStatus === "accepted"
        ? `<span class="badge badge-alive">${isEn ? "✅ Playing" : "✅ Participe"}</span>`
        : p.rsvpStatus === "declined"
        ? `<span class="badge badge-dead">${isEn ? "❌ Declined" : "❌ Ne joue pas"}</span>`
        : `<span class="badge badge-medium">${isEn ? "⏳ Invited" : "⏳ En attente"}</span>`;
      return `
        <div class="stat-box" style="justify-content:space-between; opacity:${p.rsvpStatus === 'declined' ? '0.45' : '1'};">
          <div style="display:flex; align-items:center; gap:0.7rem; min-width:0;">
            <img src="${photo}" alt="${escapeHtml(p.name)}" class="avatar-photo" style="border-color:${p.rsvpStatus === 'accepted' ? 'var(--emerald)' : 'var(--border-subtle)'};" />
            <div style="min-width:0;">
              <div style="font-weight:700; font-size:0.96rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(p.name)}</div>
              <div style="font-size:0.76rem; color:var(--text-muted);">${p.lang === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}</div>
            </div>
          </div>
          ${badge}
        </div>
      `;
    }).join("");

    return `
      <div class="grid-3" style="margin-bottom:1.1rem;">
        <div class="stat-box">
          <div class="stat-icon">✅</div>
          <div>
            <div class="stat-value">${counts.accepted}</div>
            <div class="stat-label">${isEn ? "Confirmed Players" : "Participants confirmés"}</div>
          </div>
        </div>
        <div class="stat-box">
          <div class="stat-icon">⏳</div>
          <div>
            <div class="stat-value">${counts.pending}</div>
            <div class="stat-label">${isEn ? "Waiting for reply" : "En attente de réponse"}</div>
          </div>
        </div>
        <div class="stat-box">
          <div class="stat-icon">👥</div>
          <div>
            <div class="stat-value">${g.totalPlayers}</div>
            <div class="stat-label">${isEn ? "Total Invited Guests" : "Total Invités"}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📩 ${isEn ? "Pre-Validation Guest List" : "Liste des Invités & Prévalidations"}</h3>
          <span class="badge badge-cat">${isEn ? "Waiting for Kick-off" : "Avant-Soirée"}</span>
        </div>
        <div class="grid-2">
          ${lobbyPlayersHtml}
        </div>
      </div>
    `;
  }

  const playersHtml = (g.playersList || []).map((p, idx) => {
    const photo = p.photoUrl || generateClientDefaultPhoto(p.name, idx);
    return `
      <div class="stat-box" style="justify-content:space-between; opacity:${p.alive ? '1' : '0.52'};">
        <div style="display:flex; align-items:center; gap:0.7rem; min-width:0;">
          <img src="${photo}" alt="${escapeHtml(p.name)}" class="avatar-photo" style="border-color:${p.alive ? 'var(--emerald)' : 'var(--crimson)'};" />
          <div style="min-width:0;">
            <div style="font-weight:700; font-size:0.96rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(p.name)}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">🔪 ${p.killsCount} kill(s)</div>
          </div>
        </div>
        ${p.alive
          ? `<span class="badge badge-alive">${t("aliveBadge")}</span>`
          : `<span class="badge badge-dead">${t("deadBadge")}</span>`}
      </div>
    `;
  }).join("");

  const topHtml = (g.topKillers || []).map((k, idx) => {
    const photo = k.photoUrl || generateClientDefaultPhoto(k.name, idx);
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.8rem; background:var(--bg-elevated); border-radius:var(--radius-sm); margin-bottom:0.45rem;">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span style="font-weight:900; color:var(--gold);">#${idx + 1}</span>
          <img src="${photo}" alt="${escapeHtml(k.name)}" class="avatar-photo-sm" />
          <span style="font-weight:700;">${escapeHtml(k.name)}</span>
        </div>
        <span class="badge badge-hard">${k.killsCount} kill(s)</span>
      </div>
    `;
  }).join("");

  return `
    <div class="grid-3" style="margin-bottom:1.1rem;">
      <div class="stat-box">
        <div class="stat-icon">🟢</div>
        <div>
          <div class="stat-value">${g.aliveCount} / ${g.totalPlayers}</div>
          <div class="stat-label">${t("agentsAliveLabel")}</div>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon">💀</div>
        <div>
          <div class="stat-value">${g.eliminatedCount}</div>
          <div class="stat-label">${t("murdersCommittedLabel")}</div>
        </div>
      </div>
      <div class="stat-box">
        <div class="stat-icon">🛡️</div>
        <div>
          <div class="stat-value" style="font-size:0.92rem;">${escapeHtml(counterAttackLabel(g.settings?.counterAttackRule).split("—")[0])}</div>
          <div class="stat-label">${t("counterAttackRuleLabel")}</div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${t("playersStatusTitle")}</h3>
        </div>
        <div class="grid-2">
          ${playersHtml}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${t("topKillersTitle")}</h3>
        </div>
        ${topHtml}
      </div>
    </div>
  `;
}

// --- View 4: Maître du Jeu (Admin Back-Office, Bilingual FR/EN) ---
function renderAdminView() {
  const isEn = state.lang === "en";
  if (!state.adminToken || !state.adminData) {
    return `
      <div class="card card-gold" style="max-width:460px; margin:1.5rem auto;">
        <div class="card-header">
          <h2 class="card-title">👑 ${isEn ? "Game Master Access" : "Accès Maître du Jeu"}</h2>
          <span class="badge badge-medium">Admin</span>
        </div>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1rem;">
          ${isEn
            ? "Enter the Game Master password to manage the circle, view player & target photos, and configure Brevo SMS & Google Contacts."
            : "Entre le mot de passe Maître du Jeu pour gérer la boucle, voir les photos des joueurs et cibles, configurer Brevo SMS & Google Contacts."}
        </p>
        <form onsubmit="handleAdminLogin(event)">
          <div class="form-group">
            <label class="form-label">${isEn ? "Game Master Password" : "Mot de passe Maître du Jeu"}</label>
            <input id="admin-password-input" type="password" class="input" placeholder="${isEn ? 'Admin password...' : 'Mot de passe Admin...'}" required />
          </div>
          <button type="submit" class="btn btn-gold btn-block">🔓 ${isEn ? "Unlock GM Console" : "Déverrouiller le Poste MJ"}</button>
        </form>
      </div>
    `;
  }

  return `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.65rem; margin-bottom:0.85rem;">
      <div>
        <h2 style="font-size:1.35rem; font-weight:800;">👑 ${isEn ? "Command Center — Game Master" : "Poste de Commandement — Maître du Jeu"}</h2>
        <div style="font-size:0.8rem; color:var(--text-muted);">
          ${isEn
            ? "Visual Circle Control, on-the-fly scenario replacement, Pre-Validation Lobby, Brevo SMS & Google Contacts API"
            : "Contrôle visuel du Cercle, remplacement de scénarios à la volée, Prévalidation, Brevo SMS & Google Contacts API"}
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="logoutAdmin()">🔒 ${isEn ? "GM Logout" : "Déconnexion MJ"}</button>
    </div>

    <div class="subtabs">
      <button class="subtab ${state.adminSubTab === 'live' ? 'active' : ''}" onclick="switchAdminSubTab('live')">
        ${state.adminData.game?.status === 'lobby'
          ? (isEn
              ? `📩 Pre-Validation Lobby (${state.adminData.game.players.filter(p => p.rsvpStatus === 'accepted').length}/${state.adminData.game.players.length} confirmed)`
              : `📩 Salon Prévalidation (${state.adminData.game.players.filter(p => p.rsvpStatus === 'accepted').length}/${state.adminData.game.players.length} confirmés)`)
          : (isEn
              ? `🔴 Live Circle (${state.adminData.game ? state.adminData.game.players.filter(p => p.alive).length + ' alive' : '0'})`
              : `🔴 Partie & Cercle Visuel (${state.adminData.game ? state.adminData.game.players.filter(p => p.alive).length + ' en vie' : '0'})`)}
      </button>
      <button class="subtab ${state.adminSubTab === 'generate' ? 'active' : ''}" onclick="switchAdminSubTab('generate')">
        ✨ ${isEn ? "Create Game / Lobby & Contacts" : "Générer Partie / Prévalidation & Contacts"}
      </button>
      <button class="subtab ${state.adminSubTab === 'comm' ? 'active' : ''}" onclick="switchAdminSubTab('comm')">
        📲 ${isEn ? "Brevo SMS & Messages" : "Brevo SMS & Communication"}
      </button>
      <button class="subtab ${state.adminSubTab === 'scenarios' ? 'active' : ''}" onclick="switchAdminSubTab('scenarios')">
        📚 ${isEn ? "Scenarios FR/EN" : "Scénarios FR/EN"} (${state.adminData.scenarios.length})
      </button>
    </div>

    ${state.adminSubTab === "live" ? renderAdminLiveSubTab() : ""}
    ${state.adminSubTab === "generate" ? renderAdminGenerateSubTab() : ""}
    ${state.adminSubTab === "comm" ? renderAdminCommSubTab() : ""}
    ${state.adminSubTab === "scenarios" ? renderAdminScenariosSubTab() : ""}
  `;
}

// --- Admin Sub-Tab 1: Visual Live Game OR Pre-Validation Lobby ---
function renderAdminLiveSubTab() {
  const g = state.adminData.game;
  if (!g) {
    return `
      <div class="card" style="text-align:center; padding:2.5rem;">
        <h3>Aucune partie ni prévalidation active</h3>
        <p style="color:var(--text-muted); margin:0.5rem 0 1.25rem;">Rends-toi dans « Générer Partie / Prévalidation & Contacts » pour inviter les joueurs ou lancer directement la partie.</p>
        <button class="btn btn-primary" onclick="switchAdminSubTab('generate')">✨ Créer une Prévalidation ou Partie</button>
      </div>
    `;
  }

  const baseUrl = (state.adminData.publicUrl || window.location.origin).replace(/\/$/, "");

  // === MODE 1: PRE-VALIDATION LOBBY (g.status === "lobby") ===
  if (g.status === "lobby") {
    const acceptedList = g.players.filter(p => p.rsvpStatus === "accepted");
    const pendingList = g.players.filter(p => !p.rsvpStatus || p.rsvpStatus === "pending");
    const declinedList = g.players.filter(p => p.rsvpStatus === "declined");
    const launchCount = state.includePendingOnLaunch ? (acceptedList.length + pendingList.length) : acceptedList.length;

    const filteredLobby = g.players.filter(p => {
      const st = p.rsvpStatus || "pending";
      if (state.gmLobbyFilter === "accepted") return st === "accepted";
      if (state.gmLobbyFilter === "pending") return st === "pending";
      if (state.gmLobbyFilter === "declined") return st === "declined";
      return true;
    });

    const guestCardsHtml = filteredLobby.map((p, idx) => {
      const link = `${baseUrl}/p/${p.token}`;
      const inviteMsg = buildPlayerCustomMessage(p, g, "invite");
      const waUrl = getWhatsAppUrl(p.phone, inviteMsg);
      const smsUrl = getSmsUri(p.phone, inviteMsg);
      const photo = p.photoUrl || generateClientDefaultPhoto(p.name, idx);
      const st = p.rsvpStatus || "pending";

      const stBadge = st === "accepted"
        ? `<span class="badge badge-alive">✅ Participe</span>`
        : st === "declined"
        ? `<span class="badge badge-dead">❌ Ne participe pas</span>`
        : `<span class="badge badge-medium">⏳ En attente</span>`;

      return `
        <div class="gm-player-card" style="border-left:4px solid ${st === 'accepted' ? 'var(--emerald)' : st === 'declined' ? 'var(--crimson)' : 'var(--gold)'};">
          <div class="gm-player-top">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <img src="${photo}" alt="${escapeHtml(p.name)}" class="avatar-photo" style="border-color:${st === 'accepted' ? 'var(--emerald)' : 'var(--border-subtle)'};" />
              <div>
                <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
                  <span style="font-size:1.06rem; font-weight:800;">${escapeHtml(p.name)}</span>
                  ${stBadge}
                  <button type="button" class="badge ${p.lang === 'en' ? 'badge-cat' : 'badge-easy'}" style="cursor:pointer;" title="Cliquer pour basculer FR / EN" onclick="handleTogglePlayerLang('${escapeHtml(p.id)}', '${p.lang === 'en' ? 'fr' : 'en'}')">
                    ${p.lang === 'en' ? '🇬🇧 EN (Changer)' : '🇫🇷 FR (Changer)'}
                  </button>
                  <span class="badge badge-cat">🔐 PIN: ${escapeHtml(p.pin)}</span>
                  ${p.phone ? `<span style="font-size:0.78rem; color:var(--text-muted);">📱 ${escapeHtml(p.phone)}</span>` : `<span style="font-size:0.78rem; color:#fb7185;">⚠️ Sans numéro</span>`}
                </div>
                <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">
                  Lien d'invitation : <a href="${escapeHtml(link)}" target="_blank" style="color:var(--sky);">${escapeHtml(link)}</a>
                </div>
              </div>
            </div>

            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
              <button class="btn btn-ghost btn-sm" onclick="openEditPlayerModal('${escapeHtml(p.id)}')">✏️ Photo / Infos</button>
              <button class="btn btn-ghost btn-sm" onclick="copyText('${escapeHtml(link)}', 'Lien copié !')">🔗 Lien</button>
            </div>
          </div>

          <div class="gm-player-actions" style="justify-content:space-between; margin-top:0.5rem;">
            <!-- Manual GM RSVP Override Buttons -->
            <div style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
              <span style="font-size:0.76rem; color:var(--text-muted); margin-right:0.2rem;">Statut :</span>
              <button class="btn ${st === 'accepted' ? 'btn-emerald' : 'btn-ghost'} btn-sm" onclick="handleAdminSetRsvp('${escapeHtml(p.id)}', 'accepted')">
                ✅ Participe
              </button>
              <button class="btn ${st === 'pending' ? 'btn-gold' : 'btn-ghost'} btn-sm" onclick="handleAdminSetRsvp('${escapeHtml(p.id)}', 'pending')">
                ⏳ Attente
              </button>
              <button class="btn ${st === 'declined' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="handleAdminSetRsvp('${escapeHtml(p.id)}', 'declined')">
                ❌ Ne joue pas
              </button>
            </div>

            <!-- Send Invitation Channels -->
            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
              <a href="${escapeHtml(waUrl)}" target="_blank" class="btn btn-whatsapp btn-sm">💬 Inviter WhatsApp</a>
              <a href="${escapeHtml(smsUrl)}" class="btn btn-sms btn-sm">📱 Inviter SMS PC</a>
              <button class="btn btn-ghost btn-sm" onclick="handleSendSingleExternalSms('${escapeHtml(p.id)}', 'invite')">🚀 SMS Brevo</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <!-- Pre-Validation Stats Banner -->
      <div class="grid-4" style="margin-bottom:1.1rem;">
        <div class="stat-box" style="border-color:rgba(16,185,129,0.45);">
          <div class="stat-icon">✅</div>
          <div>
            <div class="stat-value" style="color:#6ee7b7;">${acceptedList.length}</div>
            <div class="stat-label">Participants confirmés</div>
          </div>
        </div>
        <div class="stat-box" style="border-color:rgba(245,158,11,0.4);">
          <div class="stat-icon">⏳</div>
          <div>
            <div class="stat-value" style="color:var(--gold-light);">${pendingList.length}</div>
            <div class="stat-label">En attente de réponse</div>
          </div>
        </div>
        <div class="stat-box" style="border-color:rgba(225,29,72,0.4);">
          <div class="stat-icon">❌</div>
          <div>
            <div class="stat-value" style="color:#fda4af;">${declinedList.length}</div>
            <div class="stat-label">Ne participent pas</div>
          </div>
        </div>
        <div class="stat-box">
          <div class="stat-icon">👥</div>
          <div>
            <div class="stat-value">${g.players.length}</div>
            <div class="stat-label">Total Invités soirée</div>
          </div>
        </div>
      </div>

      <!-- Launch Game from Pre-Validation Box -->
      <div class="card card-gold" style="margin-bottom:1.1rem;">
        <div class="card-header">
          <div>
            <span class="badge badge-cat">SALON DE PRÉVALIDATION ACTIF</span>
            <h3 class="card-title" style="margin-top:0.3rem;">🚀 Lancer le Jeu avec les Participants Confirmés</h3>
          </div>
          <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
            <button class="btn btn-ghost btn-sm" onclick="openAddLatePlayerModal()">➕ Ajouter un invité</button>
            <button class="btn btn-gold btn-sm" onclick="handleBulkExternalSms('invite')">📨 Envoyer SMS d'Invitation Brevo à tous</button>
          </div>
        </div>

        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:0.85rem;">
          Les invités peuvent ouvrir leur lien personnel pour choisir leur langue (🇫🇷/🇬🇧), ajouter leur selfie/photo, lire les règles et cliquer sur <strong>« ✅ Oui, je participe ! »</strong>. Dès que tu es prêt à lancer la soirée, clique sur le bouton ci-dessous : la boucle et les scénarios seront générés <strong>uniquement pour les participants</strong> (en conservant leurs liens et leurs photos !).
        </p>

        <div style="background:rgba(0,0,0,0.32); padding:0.75rem; border-radius:var(--radius-sm); margin-bottom:0.9rem; display:flex; flex-direction:column; gap:0.45rem; font-size:0.84rem;">
          <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
            <input type="checkbox" ${state.includePendingOnLaunch ? 'checked' : ''} onchange="state.includePendingOnLaunch = this.checked; renderApp();" />
            Inclure aussi les invités « ⏳ En attente » (${pendingList.length}) dans la partie (exclut uniquement les « ❌ Ne joue pas »)
          </label>
          <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
            <input type="checkbox" ${state.autoSmsOnLaunch ? 'checked' : ''} onchange="state.autoSmsOnLaunch = this.checked;" />
            Envoyer automatiquement les SMS Brevo avec la Cible & Mission au moment du lancement
          </label>
        </div>

        <button class="btn btn-primary btn-block" style="font-size:1.02rem; padding:0.95rem;" onclick="handleLaunchLobbyGame()" ${launchCount < 3 ? 'disabled' : ''}>
          🚀 Lancer le Cercle des Assassins maintenant (${launchCount} participant${launchCount > 1 ? 's' : ''} — minimum 3 requis)
        </button>
      </div>

      <!-- Filter Tabs for Guest List -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.85rem;">
        <h3 style="font-size:1.05rem; font-weight:800;">📋 Liste des Invités de la Soirée (${g.players.length})</h3>
        <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
          <button class="btn ${state.gmLobbyFilter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="state.gmLobbyFilter='all'; renderApp();">
            Tous (${g.players.length})
          </button>
          <button class="btn ${state.gmLobbyFilter === 'accepted' ? 'btn-emerald' : 'btn-ghost'} btn-sm" onclick="state.gmLobbyFilter='accepted'; renderApp();">
            ✅ Participants (${acceptedList.length})
          </button>
          <button class="btn ${state.gmLobbyFilter === 'pending' ? 'btn-gold' : 'btn-ghost'} btn-sm" onclick="state.gmLobbyFilter='pending'; renderApp();">
            ⏳ En attente (${pendingList.length})
          </button>
          <button class="btn ${state.gmLobbyFilter === 'declined' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="state.gmLobbyFilter='declined'; renderApp();">
            ❌ Ne jouent pas (${declinedList.length})
          </button>
        </div>
      </div>

      ${guestCardsHtml}
    `;
  }

  // === MODE 2: ACTIVE / FINISHED GAME ===
  const alivePlayers = g.players.filter(p => p.alive);
  let orderedCircle = [];
  if (alivePlayers.length > 0) {
    const mapById = new Map(g.players.map(p => [p.id, p]));
    let curr = alivePlayers[0];
    const visited = new Set();
    while (curr && !visited.has(curr.id)) {
      visited.add(curr.id);
      orderedCircle.push(curr);
      curr = mapById.get(curr.targetId);
    }
    for (const ap of alivePlayers) {
      if (!visited.has(ap.id)) orderedCircle.push(ap);
    }
  }

  const chainHtml = orderedCircle.length > 0
    ? orderedCircle.map((p, idx) => {
        const photo = p.photoUrl || generateClientDefaultPhoto(p.name, idx);
        return `
          <span class="chain-node">
            <img src="${photo}" class="avatar-photo-sm" alt="${escapeHtml(p.name)}" />
            ${escapeHtml(p.name)}
          </span>
          <span class="chain-arrow">➔</span>
        `;
      }).join("") + `
      <span class="chain-node" style="border-color:var(--gold); color:var(--gold-light);">
        🔄 ${escapeHtml(orderedCircle[0].name)}
      </span>`
    : `<span style="color:var(--text-muted);">Aucun survivant</span>`;

  const filteredPlayers = g.players.filter(p => {
    if (state.gmPlayerFilter === "alive") return p.alive;
    if (state.gmPlayerFilter === "dead") return !p.alive;
    return true;
  });

  const playerCardsHtml = filteredPlayers.map((p, idx) => {
    const target = g.players.find(x => x.id === p.targetId);
    const link = `${baseUrl}/p/${p.token}`;
    const startMsg = buildPlayerCustomMessage(p, g, "start");
    const waUrl = getWhatsAppUrl(p.phone, startMsg);
    const smsUrl = getSmsUri(p.phone, startMsg);
    const hunterPhoto = p.photoUrl || generateClientDefaultPhoto(p.name, idx);
    const targetPhoto = target ? (target.photoUrl || generateClientDefaultPhoto(target.name, idx + 1)) : "";

    return `
      <div class="gm-player-card ${p.alive ? '' : 'dead'}">
        <div class="gm-player-top">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <img src="${hunterPhoto}" alt="${escapeHtml(p.name)}" class="avatar-photo" style="border-color:${p.alive ? 'var(--emerald)' : 'var(--crimson)'};" />
            <div>
              <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
                <span style="font-size:1.08rem; font-weight:800;">${escapeHtml(p.name)}</span>
                <button type="button" class="badge ${p.lang === 'en' ? 'badge-cat' : 'badge-easy'}" style="cursor:pointer;" title="Cliquer pour basculer FR / EN" onclick="handleTogglePlayerLang('${escapeHtml(p.id)}', '${p.lang === 'en' ? 'fr' : 'en'}')">
                  ${p.lang === 'en' ? '🇬🇧 EN (Changer)' : '🇫🇷 FR (Changer)'}
                </button>
                ${p.alive ? `<span class="badge badge-alive">En Vie</span>` : `<span class="badge badge-dead">💀 Éliminé</span>`}
                <span class="badge badge-cat">🔐 PIN: ${escapeHtml(p.pin)}</span>
                <span class="badge badge-medium">🔪 ${p.kills?.length || 0} kill(s)</span>
                ${p.phone ? `<span style="font-size:0.78rem; color:var(--text-muted);">📱 ${escapeHtml(p.phone)}</span>` : `<span style="font-size:0.78rem; color:#fb7185;">⚠️ Sans numéro</span>`}
              </div>
              <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.15rem;">
                Dossier : <a href="${escapeHtml(link)}" target="_blank" style="color:var(--sky);">${escapeHtml(link)}</a>
              </div>
            </div>
          </div>

          <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
            <button class="btn btn-ghost btn-sm" onclick="openEditPlayerModal('${escapeHtml(p.id)}')">✏️ Photo / Infos</button>
            <button class="btn btn-ghost btn-sm" onclick="copyText('${escapeHtml(link)}', 'Lien copié !')">🔗 Lien</button>
          </div>
        </div>

        ${p.alive && target ? `
          <div class="gm-duo-banner">
            <!-- Visual Hunter -> Target Photo Duo -->
            <div class="gm-duo-avatars">
              <div class="gm-duo-person">
                <img src="${hunterPhoto}" alt="${escapeHtml(p.name)}" class="avatar-photo" style="border-color:var(--emerald);" />
                <span style="font-size:0.74rem; font-weight:700;">🕵️ ${escapeHtml(p.name)}</span>
              </div>
              <div style="font-size:1.3rem; color:var(--crimson); font-weight:900;">➔ 🎯</div>
              <div class="gm-duo-person">
                <img src="${targetPhoto}" alt="${escapeHtml(target.name)}" class="avatar-photo" style="border-color:var(--crimson); width:56px; height:56px;" />
                <span style="font-size:0.82rem; font-weight:800; color:#fda4af;">${escapeHtml(target.name)}</span>
              </div>
            </div>

            <!-- Active Scenario Box -->
            <div>
              <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
                <span style="font-size:0.74rem; text-transform:uppercase; color:var(--gold);">Scénario :</span>
                <strong style="color:var(--gold-light);">${escapeHtml(p.scenario?.title || "Aucun")}</strong>
                ${p.lang === 'en' && p.scenario?.title_en ? `<span style="font-size:0.78rem; color:var(--sky);">(${escapeHtml(p.scenario.title_en)})</span>` : ""}
                ${difficultyBadge(p.scenario)}
              </div>
              <div style="font-size:0.9rem; color:#fff; margin-top:0.2rem;">
                🇫🇷 ${escapeHtml(p.scenario?.description || "")}
              </div>
              ${p.lang === 'en' && p.scenario?.description_en ? `
                <div style="font-size:0.82rem; color:var(--sky); margin-top:0.15rem;">
                  🇬🇧 ${escapeHtml(p.scenario.description_en)}
                </div>
              ` : ""}
            </div>
          </div>

          <div class="gm-player-actions">
            <button class="btn btn-gold btn-sm" onclick="handleQuickRandomScenario('${escapeHtml(p.id)}')">
              🎲 Nouveau scénario au hasard
            </button>
            <button class="btn btn-ghost btn-sm" style="border-color:var(--border-gold); color:var(--gold-light);" onclick="openReplaceScenarioModal('${escapeHtml(p.id)}')">
              ✍️ Choisir / Scénario sur-mesure
            </button>
            <button class="btn btn-primary btn-sm" onclick="handleForceKill('${escapeHtml(p.id)}', '${escapeHtml(p.name)}', '${escapeHtml(target.name)}')">
              🗡️ Valider Kill (${escapeHtml(p.name)} ➔ ${escapeHtml(target.name)})
            </button>
            <a href="${escapeHtml(waUrl)}" target="_blank" class="btn btn-whatsapp btn-sm">💬 WhatsApp</a>
            <a href="${escapeHtml(smsUrl)}" class="btn btn-sms btn-sm">📱 SMS PC</a>
            <button class="btn btn-ghost btn-sm" onclick="handleSendSingleExternalSms('${escapeHtml(p.id)}', 'start')">🚀 SMS Brevo</button>
          </div>
        ` : `
          <div style="font-size:0.84rem; color:var(--text-muted);">
            💀 Éliminé par <strong>${escapeHtml(p.killedBy?.killerName || "?")}</strong> à ${formatTime(p.killedBy?.timestamp)} (${escapeHtml(p.killedBy?.scenarioTitle || "")})
          </div>
        `}
      </div>
    `;
  }).join("");

  const archivedGuests = g.invitedArchive || [];
  const archivedHtml = archivedGuests.length === 0 ? "" : `
    <div class="card" style="margin-top:1.25rem; opacity:0.85;">
      <div class="card-header">
        <h3 class="card-title">📋 Invités Non-Participants de la Prévalidation (${archivedGuests.length})</h3>
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:0.55rem;">
        ${archivedGuests.map((ag, i) => `
          <div style="display:flex; align-items:center; gap:0.45rem; background:var(--bg-elevated); border:1px solid var(--border-subtle); padding:0.35rem 0.65rem; border-radius:999px;">
            <img src="${ag.photoUrl || generateClientDefaultPhoto(ag.name, i)}" class="avatar-photo-sm" alt="${escapeHtml(ag.name)}" />
            <span style="font-size:0.82rem; font-weight:700;">${escapeHtml(ag.name)}</span>
            <span class="badge badge-dead" style="font-size:0.65rem;">${ag.rsvpStatus === 'declined' ? 'Refusé' : 'Non confirmé'}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  return `
    <div class="card card-crimson">
      <div class="card-header">
        <div>
          <h3 class="card-title">🔄 Boucle Circulaire Visuelle (${alivePlayers.length} survivants)</h3>
          <div style="font-size:0.8rem; color:var(--text-muted);">Chaque agent chasse la cible située juste à sa droite dans le cercle.</div>
        </div>
        <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" onclick="openAddLatePlayerModal()">➕ Insérer un joueur</button>
          <button class="btn btn-ghost btn-sm" onclick="handleUndoKill()" ${(!g.undoStack || g.undoStack.length === 0) ? "disabled" : ""}>
            ⏪ Annuler dernier kill
          </button>
        </div>
      </div>

      <div class="circle-chain">
        ${chainHtml}
      </div>

      <div style="margin-top:0.9rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.65rem;">
        <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
          <span style="font-size:0.82rem; color:var(--text-muted);">Contre-Attaque :</span>
          <select class="select" style="width:auto; padding:0.35rem 0.65rem; font-size:0.82rem;" onchange="handleUpdateCounterRule(this.value)">
            <option value="option_a" ${g.settings.counterAttackRule === 'option_a' ? 'selected' : ''}>Option A (Mission grillée = Nouveau scénario)</option>
            <option value="option_b_immunity" ${g.settings.counterAttackRule === 'option_b_immunity' ? 'selected' : ''}>Option B1 (Punitive : 15 min d'immunité cible)</option>
            <option value="option_b_elimination" ${g.settings.counterAttackRule === 'option_b_elimination' ? 'selected' : ''}>Option B2 (Punitive : Assassin éliminé)</option>
            <option value="none" ${g.settings.counterAttackRule === 'none' ? 'selected' : ''}>Aucune (Désactivée)</option>
          </select>
        </div>

        <div style="display:flex; gap:0.35rem;">
          <button class="btn ${state.gmPlayerFilter === 'alive' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="setGmFilter('alive')">
            🟢 En vie (${alivePlayers.length})
          </button>
          <button class="btn ${state.gmPlayerFilter === 'dead' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="setGmFilter('dead')">
            💀 Morts (${g.players.length - alivePlayers.length})
          </button>
          <button class="btn ${state.gmPlayerFilter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="setGmFilter('all')">
            Tous (${g.players.length})
          </button>
        </div>
      </div>
    </div>

    ${playerCardsHtml}
    ${archivedHtml}
  `;
}

function buildContactsListHtml() {
  const contacts = state.adminData?.contacts || [];
  const filteredContacts = contacts.filter(c => {
    const q = state.contactSearch.toLowerCase().trim();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || (c.phone || "").includes(q);
  });

  if (filteredContacts.length === 0) {
    return `<div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.84rem;">Aucun contact trouvé.</div>`;
  }
  return filteredContacts.map(c => `
    <label class="contact-item" style="cursor:pointer;">
      <div style="display:flex; align-items:center; gap:0.55rem;">
        <input type="checkbox" ${state.selectedContactIds.has(c.id) ? "checked" : ""} onchange="toggleSelectContact('${escapeHtml(c.id)}', this.checked)" />
        <span style="font-weight:600; color:#fff;">${escapeHtml(c.name)}</span>
      </div>
      <span style="color:var(--sky); font-family:monospace; font-size:0.8rem;">${escapeHtml(c.phone || "Sans numéro")}</span>
    </label>
  `).join("");
}

function handleContactSearchInput(val) {
  state.contactSearch = val;
  const box = document.getElementById("contacts-list-box");
  if (box) box.innerHTML = buildContactsListHtml();
}

// --- Admin Sub-Tab 2: Generate Game & Google Contacts API Config ---
function renderAdminGenerateSubTab() {
  const contacts = state.adminData.contacts || [];
  const cfg = state.adminData.commConfig || {};

  const rowsHtml = state.draftPlayers.map((p, idx) => `
    <div style="display:grid; grid-template-columns: 28px 1.2fr 1fr 68px 36px; gap:0.35rem; align-items:center; margin-bottom:0.45rem;">
      <span style="font-weight:700; color:var(--text-muted); font-size:0.8rem; text-align:center;">#${idx + 1}</span>
      <input type="text" class="input" placeholder="Prénom du joueur" value="${escapeHtml(p.name)}" oninput="updateDraftPlayer(${idx}, 'name', this.value)" />
      <input type="tel" class="input" placeholder="06 12 34 56 78" value="${escapeHtml(p.phone)}" oninput="updateDraftPlayer(${idx}, 'phone', this.value)" />
      <button type="button" class="btn btn-ghost btn-sm" style="padding:0.4rem;" onclick="updateDraftPlayer(${idx}, 'lang', '${p.lang === 'en' ? 'fr' : 'en'}'); renderApp();" title="Langue du joueur">
        ${p.lang === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
      </button>
      <button type="button" class="btn btn-ghost btn-sm" onclick="removeDraftPlayer(${idx})" title="Supprimer">✕</button>
    </div>
  `).join("");

  const contactsListHtml = buildContactsListHtml();

  return `
    <div class="grid-2">
      <!-- Left Column: Game Settings & Players -->
      <div class="card card-crimson">
        <div class="card-header">
          <h3 class="card-title">✨ Configuration de la Nouvelle Partie</h3>
        </div>

        <div class="form-group">
          <label class="form-label">Nom de la partie / événement</label>
          <input type="text" class="input" value="${escapeHtml(state.draftSettings.name)}" oninput="state.draftSettings.name = this.value" />
        </div>

        <div class="form-group">
          <label class="form-label">🛡️ Règle de Contre-Attaque</label>
          <select class="select" onchange="state.draftSettings.counterAttackRule = this.value">
            <option value="option_a" ${state.draftSettings.counterAttackRule === 'option_a' ? 'selected' : ''}>Option A (Classique) : Mission grillée ➔ Nouveau scénario</option>
            <option value="option_b_immunity" ${state.draftSettings.counterAttackRule === 'option_b_immunity' ? 'selected' : ''}>Option B1 (Punitive) : Assassin démasqué ➔ 15 min d'immunité cible</option>
            <option value="option_b_elimination" ${state.draftSettings.counterAttackRule === 'option_b_elimination' ? 'selected' : ''}>Option B2 (Mortelle) : Assassin démasqué ➔ Assassin éliminé</option>
            <option value="none" ${state.draftSettings.counterAttackRule === 'none' ? 'selected' : ''}>Pas d'option : Aucune contre-attaque</option>
          </select>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">🔐 Validation d'un meurtre</label>
            <select class="select" onchange="state.draftSettings.killValidationMode = this.value">
              <option value="pin" ${state.draftSettings.killValidationMode === 'pin' ? 'selected' : ''}>Code PIN Victime (Recommandé)</option>
              <option value="open" ${state.draftSettings.killValidationMode === 'open' ? 'selected' : ''}>Validation directe en 1 clic</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">🎭 Difficulté des scénarios</label>
            <select class="select" onchange="state.draftSettings.difficultyFilter = this.value">
              <option value="all" ${state.draftSettings.difficultyFilter === 'all' ? 'selected' : ''}>Toutes difficultés (60)</option>
              <option value="easy_medium" ${state.draftSettings.difficultyFilter === 'easy_medium' ? 'selected' : ''}>Facile & Moyen</option>
              <option value="easy" ${state.draftSettings.difficultyFilter === 'easy' ? 'selected' : ''}>Facile uniquement</option>
              <option value="medium_hard" ${state.draftSettings.difficultyFilter === 'medium_hard' ? 'selected' : ''}>Moyen & Difficile</option>
            </select>
          </div>
        </div>

        <div style="margin: 0.85rem 0 0.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.4rem;">
          <label class="form-label" style="margin:0;">👥 Joueurs (${state.draftPlayers.filter(p => p.name.trim()).length})</label>
          <div style="display:flex; gap:0.35rem;">
            <button type="button" class="btn btn-ghost btn-sm" onclick="addDraftPlayerRow()">➕ Ligne</button>
            <button type="button" class="btn btn-ghost btn-sm" onclick="loadCurrentGamePlayersIntoDraft()">🔄 Reprendre actuels</button>
          </div>
        </div>

        <div style="max-height:310px; overflow-y:auto; margin-bottom:0.9rem;">
          ${rowsHtml}
        </div>

        <div style="display:flex; flex-direction:column; gap:0.55rem;">
          <button class="btn btn-gold btn-block" onclick="handleGenerateGame('lobby')">
            📩 1. Ouvrir le Salon de Prévalidation (Inviter la liste, récolter participations & photos)
          </button>
          <button class="btn btn-primary btn-block" onclick="handleGenerateGame('active')">
            🚀 2. Générer & Lancer directement la Partie (Sans prévalidation)
          </button>
        </div>
      </div>

      <!-- Right Column: Google Contacts & API Key Config -->
      <div class="card card-gold">
        <div class="card-header">
          <h3 class="card-title">📇 Google Contacts & Configuration Clés API</h3>
          <span class="badge badge-medium">${contacts.length} contact(s)</span>
        </div>

        <!-- Google API Credentials Setup Box -->
        <div style="background:rgba(0,0,0,0.35); border:1px solid var(--border-gold); border-radius:var(--radius-sm); padding:0.85rem; margin-bottom:0.85rem;">
          <div style="font-weight:700; font-size:0.88rem; color:var(--gold-light); margin-bottom:0.4rem;">
            🔑 Paramétrage des Clés API Google Contacts (People API)
          </div>
          <div style="font-size:0.76rem; color:var(--text-muted); margin-bottom:0.55rem;">
            Dans <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style="color:var(--sky);">Google Cloud Console</a>, crée un <strong>ID client OAuth 2.0 (Application Web)</strong> avec l'origine JavaScript autorisée <code>${escapeHtml(window.location.origin)}</code> et active l'API <em>Google People API</em>.
          </div>
          <div class="form-group" style="margin-bottom:0.5rem;">
            <label class="form-label">Google OAuth Client ID</label>
            <input id="google-client-id-input" type="text" class="input" placeholder="123456789-xxx.apps.googleusercontent.com" value="${escapeHtml(cfg.googleClientId || '')}" />
          </div>
          <div class="form-group" style="margin-bottom:0.6rem;">
            <label class="form-label">Google API Key (Optionnel)</label>
            <input id="google-api-key-input" type="password" class="input" placeholder="AIzaSy..." value="${escapeHtml(cfg.googleApiKey || '')}" />
          </div>
          <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
            <button type="button" class="btn btn-gold btn-sm" onclick="handleSaveGoogleApiConfig()">
              💾 Enregistrer les clés Google
            </button>
            <button type="button" class="btn btn-primary btn-sm" onclick="handleGoogleOAuthSync()">
              🔗 Synchroniser mes Contacts Google (API)
            </button>
            <button type="button" class="btn btn-ghost btn-sm" onclick="handleNativeContactPicker()">
              📱 Contacts du Téléphone
            </button>
          </div>
        </div>

        <!-- Alternative: 1-click CSV / vCard import -->
        <div style="background:rgba(0,0,0,0.28); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); margin-bottom:0.85rem;">
          <div style="font-weight:700; font-size:0.84rem; margin-bottom:0.25rem;">📂 Ou importer un fichier Google Contacts (.csv / .vcf vCard)</div>
          <input type="file" accept=".csv,.vcf,text/csv,text/vcard" class="input" style="padding:0.4rem; font-size:0.82rem;" onchange="handleGoogleContactsFileUpload(event)" />
        </div>

        <div class="form-group" style="margin-bottom:0.45rem;">
          <input id="contact-search-input" type="text" class="input" placeholder="🔍 Rechercher un contact..." value="${escapeHtml(state.contactSearch)}" oninput="handleContactSearchInput(this.value)" />
        </div>

        <div id="contacts-list-box" class="contacts-list-box">
          ${contactsListHtml}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem; gap:0.5rem; flex-wrap:wrap;">
          <button id="add-selected-contacts-btn" type="button" class="btn btn-emerald btn-sm" onclick="addSelectedContactsToDraft()">
            ➕ Ajouter les contacts cochés (${state.selectedContactIds.size}) à la partie
          </button>
          ${contacts.length > 0 ? `<button type="button" class="btn btn-ghost btn-sm" onclick="clearAllContacts()">🗑️ Vider</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

// --- Admin Sub-Tab 3: Brevo SMS Configuration, Live Tester & Multi-Channel Dispatch ---
function renderAdminCommSubTab() {
  const cfg = state.adminData.commConfig || {};
  const g = state.adminData.game;
  const players = g?.players || [];
  const logs = state.adminData.commLogs || [];

  const queueRowsHtml = players.map(p => {
    const msg = buildPlayerCustomMessage(p, g, "start");
    const waUrl = getWhatsAppUrl(p.phone, msg);
    const smsUrl = getSmsUri(p.phone, msg);
    const isSent = state.sentQueueTracker.has(p.id);
    const photo = p.photoUrl || generateClientDefaultPhoto(p.name, 0);

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.75rem; background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); margin-bottom:0.45rem; flex-wrap:wrap; gap:0.5rem;">
        <div style="display:flex; align-items:center; gap:0.55rem;">
          <img src="${photo}" class="avatar-photo-sm" alt="${escapeHtml(p.name)}" />
          <div>
            <span style="font-weight:700;">${escapeHtml(p.name)}</span>
            <span class="badge ${p.lang === 'en' ? 'badge-cat' : 'badge-easy'}" style="margin-left:0.3rem;">${p.lang === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}</span>
            <span style="font-size:0.8rem; color:var(--text-muted); margin-left:0.4rem;">${escapeHtml(p.phone || "⚠️ Sans numéro")}</span>
            ${isSent ? `<span class="badge badge-alive" style="margin-left:0.4rem;">✓ Envoyé</span>` : ""}
          </div>
        </div>
        <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="handleSendSingleExternalSms('${escapeHtml(p.id)}')">
            🚀 Envoyer SMS Brevo
          </button>
          <a href="${escapeHtml(waUrl)}" target="_blank" class="btn btn-whatsapp btn-sm" onclick="markQueueSent('${escapeHtml(p.id)}')">
            💬 WhatsApp
          </a>
          <a href="${escapeHtml(smsUrl)}" class="btn btn-sms btn-sm" onclick="markQueueSent('${escapeHtml(p.id)}')">
            📱 SMS PC
          </a>
          <button class="btn btn-ghost btn-sm" onclick="openSmsQrModal('${escapeHtml(p.id)}')">
            📷 QR
          </button>
        </div>
      </div>
    `;
  }).join("");

  const logsHtml = logs.length === 0
    ? `<p style="color:var(--text-muted); font-size:0.84rem;">Aucun SMS envoyé pour le moment.</p>`
    : logs.slice(0, 12).map(l => `
        <div style="padding:0.5rem 0.7rem; background:rgba(0,0,0,0.3); border-left:3px solid var(--emerald); border-radius:4px; margin-bottom:0.4rem; font-size:0.8rem; display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <strong>${escapeHtml(l.playerName)}</strong> (${escapeHtml(l.phone)}) • <span style="color:var(--gold-light);">${escapeHtml(l.detail)}</span>
          </div>
          <span style="color:var(--text-muted);">${formatTime(l.timestamp)}</span>
        </div>
      `).join("");

  return `
    <!-- Dedicated Brevo SMS Setup & Live Tester -->
    <div class="grid-2" style="margin-bottom:1.1rem;">
      <div class="card card-gold">
        <div class="card-header">
          <h3 class="card-title">🥇 Configuration Clé API Brevo SMS</h3>
          ${cfg.brevoApiKey ? `<span class="badge badge-alive">✓ Clé enregistrée</span>` : `<span class="badge badge-hard">⚠️ Clé requise</span>`}
        </div>
        <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:0.85rem;">
          Dans ton compte <strong>Brevo</strong> ➔ clique sur ton nom en haut à droite ➔ <strong>SMTP & API</strong> ➔ onglet <strong>Clés API</strong> ➔ génère une clé API v3 (commençant par <code>xkeysib-...</code>) et colle-la ci-dessous :
        </p>

        <form onsubmit="handleSaveBrevoConfig(event)">
          <div class="form-group">
            <label class="form-label">Clé API Brevo v3 (xkeysib-...)</label>
            <input id="brevo-api-key-input" type="password" class="input" placeholder="xkeysib-..." value="${escapeHtml(cfg.brevoApiKey || '')}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nom d'expéditeur affiché sur le SMS (max 11 lettres/chiffres)</label>
            <input id="brevo-sender-input" type="text" maxlength="11" class="input" value="${escapeHtml(cfg.brevoSender || 'KILLER')}" required />
          </div>

          <div style="background:rgba(0,0,0,0.3); padding:0.75rem; border-radius:var(--radius-sm); margin-bottom:0.85rem; font-size:0.82rem;">
            <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem; cursor:pointer;">
              <input id="brevo-auto-start" type="checkbox" ${cfg.autoSendOnStart ? 'checked' : ''} />
              Envoyer automatiquement les SMS Brevo dès la génération de la partie
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem; cursor:pointer;">
              <input id="brevo-auto-scenario" type="checkbox" ${cfg.autoSendOnScenarioChange ? 'checked' : ''} />
              Envoyer un SMS Brevo quand le MJ remplace un scénario à la volée
            </label>
            <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input id="brevo-auto-kill" type="checkbox" ${cfg.autoSendOnKill ? 'checked' : ''} />
              Envoyer un SMS Brevo à l'assassin avec sa nouvelle cible après chaque kill
            </label>
          </div>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button type="submit" class="btn btn-gold" style="flex:1;">
              💾 Enregistrer & Vérifier le Compte Brevo
            </button>
          </div>
        </form>

        ${state.brevoCheckStatus ? `
          <div style="margin-top:0.85rem; padding:0.75rem; border-radius:var(--radius-sm); background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.4); font-size:0.84rem;">
            ✅ <strong>Compte Brevo connecté :</strong> ${escapeHtml(state.brevoCheckStatus.email)} (${escapeHtml(state.brevoCheckStatus.companyName || '')})<br/>
            💳 <strong>Crédits SMS disponibles :</strong> ${escapeHtml(String(state.brevoCheckStatus.smsCredits))}
          </div>
        ` : ""}
      </div>

      <!-- Live SMS Tester Box -->
      <div class="card card-crimson">
        <div class="card-header">
          <h3 class="card-title">🧪 Tester l'Envoi d'un SMS Brevo</h3>
          <span class="badge badge-cat">Test en Direct</span>
        </div>
        <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:0.85rem;">
          Entre ton propre numéro de téléphone portable ci-dessous pour envoyer immédiatement un SMS de test via ton compte Brevo et vérifier la réception :
        </p>

        <form onsubmit="handleTestBrevoSms(event)">
          <div class="form-group">
            <label class="form-label">Numéro de téléphone de test (ex: 06 12 34 56 78)</label>
            <input id="test-sms-phone" type="tel" class="input" placeholder="06 12 34 56 78" value="${escapeHtml(state.testSmsPhone)}" oninput="state.testSmsPhone = this.value" required />
          </div>
          <div class="form-group">
            <label class="form-label">Message de test</label>
            <textarea id="test-sms-message" class="textarea" rows="3">🎯 [TEST KILLER] Ton service d'envoi SMS Brevo pour Le Cercle des Assassins est 100% opérationnel ! ${escapeHtml(window.location.origin)}</textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">
            🚀 Envoyer le SMS de Test maintenant
          </button>
        </form>

        <div style="margin-top:1rem; padding-top:0.85rem; border-top:1px solid var(--border-subtle);">
          <div style="font-weight:700; font-size:0.84rem; margin-bottom:0.45rem;">📜 Historique des derniers SMS envoyés (${logs.length})</div>
          <div style="max-height:150px; overflow-y:auto;">
            ${logsHtml}
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Dispatch Queue to Players -->
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">📨 Envoi des Contrats aux Joueurs (${players.length})</h3>
          <div style="font-size:0.8rem; color:var(--text-muted);">
            Les messages sont automatiquement rédigés en 🇫🇷 Français ou 🇬🇧 Anglais selon la langue du joueur.
          </div>
        </div>
        <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="handleBulkExternalSms('start')">
            🚀 Tout envoyer en 1 clic via SMS Brevo
          </button>
          <button class="btn btn-ghost btn-sm" onclick="openBroadcastModal()">
            📢 Envoyer une Annonce Globale
          </button>
        </div>
      </div>
      ${queueRowsHtml || `<p style="color:var(--text-muted); font-size:0.86rem;">Génère d'abord une partie pour voir la liste d'envoi des joueurs.</p>`}
    </div>
  `;
}

// --- Admin Sub-Tab 4: Bilingual Scenarios Catalog ---
function renderAdminScenariosSubTab() {
  const scenarios = state.adminData.scenarios || [];
  const filtered = scenarios.filter(s => {
    if (state.scenarioCategoryFilter !== "all" && s.category !== state.scenarioCategoryFilter) return false;
    const q = state.scenarioSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      (s.title_en || "").toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.description_en || "").toLowerCase().includes(q)
    );
  });

  const listHtml = filtered.map(s => `
    <div style="background:var(--bg-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.9rem; display:flex; justify-content:space-between; align-items:flex-start; gap:0.75rem;">
      <div>
        <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap; margin-bottom:0.25rem;">
          <strong style="color:var(--gold-light); font-size:0.96rem;">🇫🇷 ${escapeHtml(s.title)}</strong>
          ${s.title_en ? `<span style="color:var(--sky); font-size:0.88rem; font-weight:700;">• 🇬🇧 ${escapeHtml(s.title_en)}</span>` : ""}
          <span class="badge badge-cat">${escapeHtml(s.category)}</span>
          ${difficultyBadge(s)}
        </div>
        <div style="color:#fff; font-size:0.88rem; margin-bottom:0.2rem;">🇫🇷 ${escapeHtml(s.description)}</div>
        ${s.description_en ? `<div style="color:#94a3b8; font-size:0.84rem;">🇬🇧 ${escapeHtml(s.description_en)}</div>` : ""}
      </div>
      <button class="btn btn-ghost btn-sm" onclick="handleDeleteScenario('${escapeHtml(s.id)}')">🗑️</button>
    </div>
  `).join("");

  return `
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">➕ Ajouter un Scénario (FR & EN)</h3>
        </div>
        <form onsubmit="handleAddScenario(event)">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">🇫🇷 Titre (Français)</label>
              <input id="new-sc-title" type="text" class="input" placeholder="Ex: Le Mot Interdit" required />
            </div>
            <div class="form-group">
              <label class="form-label">🇬🇧 Title (English)</label>
              <input id="new-sc-title-en" type="text" class="input" placeholder="Ex: The Forbidden Word" />
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Catégorie</label>
              <select id="new-sc-cat" class="select">
                <option value="Piège Verbal">Piège Verbal / Verbal Trap</option>
                <option value="Objet & Poison">Objet & Poison / Object</option>
                <option value="Action & Geste">Action & Geste / Action</option>
                <option value="Mise en Situation">Mise en Situation / Situational</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Difficulté</label>
              <select id="new-sc-diff" class="select">
                <option value="Facile">Facile / Easy</option>
                <option value="Moyen" selected>Moyen / Medium</option>
                <option value="Difficile">Difficile / Hard</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">🇫🇷 Description de la mission (Français)</label>
            <textarea id="new-sc-desc" class="textarea" rows="2" required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">🇬🇧 Mission description (English)</label>
            <textarea id="new-sc-desc-en" class="textarea" rows="2"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">➕ Enregistrer le Scénario</button>
        </form>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">📚 Catalogue Bilingue (${filtered.length} / ${scenarios.length})</h3>
        </div>
        <div style="display:flex; gap:0.45rem; margin-bottom:0.8rem; flex-wrap:wrap;">
          <input id="scenario-search-input" type="text" class="input" style="flex:1;" placeholder="🔍 Chercher FR / EN..." value="${escapeHtml(state.scenarioSearch)}" oninput="state.scenarioSearch = this.value; renderApp();" />
        </div>
        <div style="max-height:500px; overflow-y:auto; display:flex; flex-direction:column; gap:0.55rem;">
          ${listHtml}
        </div>
      </div>
    </div>
  `;
}

// --- Onboarding, Pre-Validation RSVP & Profile Photo Handlers ---
function selectDefaultPortrait(idx) {
  state.tempPortraitIdx = idx;
  state.tempOnboardPhoto = "";
  renderApp();
}

async function selectDefaultPortraitAndSave(idx) {
  state.tempPortraitIdx = idx;
  state.tempOnboardPhoto = "";
  try {
    const res = await apiFetch("/api/player/profile", {
      method: "POST",
      body: JSON.stringify({
        token: state.playerToken,
        portraitIndex: idx,
        lang: state.lang
      })
    });
    state.playerDossier = res.dossier;
    showToast(state.lang === "en" ? "📸 Portrait updated!" : "📸 Portrait mis à jour !", "success");
    await refreshData();
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleLobbyPhotoUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await resizeImageFile(file, 320);
    state.tempOnboardPhoto = dataUrl;
    const res = await apiFetch("/api/player/profile", {
      method: "POST",
      body: JSON.stringify({
        token: state.playerToken,
        photoUrl: dataUrl,
        lang: state.lang,
        onboarded: true
      })
    });
    state.playerDossier = res.dossier;
    showToast(state.lang === "en" ? "📸 Your photo has been saved!" : "📸 Ta photo de profil a bien été enregistrée !", "success");
    await refreshData();
  } catch (err) {
    showToast("Erreur lors du chargement de la photo.");
  }
}

async function handlePlayerRsvp(rsvpStatus) {
  try {
    const payload = {
      token: state.playerToken,
      rsvpStatus,
      lang: state.lang,
      onboarded: true
    };
    if (state.tempOnboardPhoto) {
      payload.photoUrl = state.tempOnboardPhoto;
    }
    const res = await apiFetch("/api/player/profile", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    state.playerDossier = res.dossier;
    const isEn = state.lang === "en";
    if (rsvpStatus === "accepted") {
      showToast(isEn ? "✅ Participation confirmed! Don't forget to add your photo." : "✅ Participation confirmée ! N'oublie pas d'ajouter ta photo.", "success");
    } else {
      showToast(isEn ? "Response saved (Not participating)." : "Réponse enregistrée (Non-participation).", "gold");
    }
    await refreshData();
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleAdminSetRsvp(playerId, rsvpStatus) {
  try {
    await apiFetch("/api/admin/player/update", {
      method: "POST",
      body: JSON.stringify({ playerId, rsvpStatus })
    });
    await refreshData();
    showToast("Statut de participation mis à jour !", "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleTogglePlayerLang(playerId, newLang) {
  try {
    await apiFetch("/api/admin/player/update", {
      method: "POST",
      body: JSON.stringify({ playerId, lang: newLang })
    });
    await refreshData();
    showToast(`Langue du joueur passée en ${newLang === 'en' ? '🇬🇧 English' : '🇫🇷 Français'} !`, "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleLaunchLobbyGame() {
  const g = state.adminData?.game;
  if (!g) return;
  const acceptedCount = g.players.filter(p => p.rsvpStatus === "accepted" || (state.includePendingOnLaunch && p.rsvpStatus === "pending")).length;
  if (acceptedCount < 3) {
    showToast("Il faut au moins 3 participants confirmés pour lancer la boucle du Killer !");
    return;
  }
  if (!confirm(`Lancer officiellement le Cercle des Assassins avec les ${acceptedCount} participants ? Les cibles et missions secrètes vont être générées.`)) return;

  try {
    await apiFetch("/api/admin/game/launch-lobby", {
      method: "POST",
      body: JSON.stringify({
        includePending: state.includePendingOnLaunch,
        autoSendSms: state.autoSmsOnLaunch
      })
    });
    await refreshData();
    showToast(`🚀 Partie lancée avec ${acceptedCount} assassins dans la boucle !`, "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handlePlayerPhotoFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const dataUrl = await resizeImageFile(file, 320);
    state.tempOnboardPhoto = dataUrl;
    renderApp();
  } catch (err) {
    showToast("Erreur lors du chargement de la photo.");
  }
}

async function savePlayerOnboarding() {
  try {
    const payload = {
      token: state.playerToken,
      lang: state.lang,
      onboarded: true
    };
    if (state.tempOnboardPhoto) {
      payload.photoUrl = state.tempOnboardPhoto;
    } else {
      payload.portraitIndex = state.tempPortraitIdx;
    }
    const res = await apiFetch("/api/player/profile", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    state.playerDossier = res.dossier;
    state.showOnboardingEditor = false;
    state.tempOnboardPhoto = "";
    showToast(state.lang === "en" ? "✅ Profile saved! Here is your secret contract." : "✅ Profil enregistré ! Voici ton contrat secret.", "success");
    await refreshData();
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

function openOnboardingEditor() {
  state.showOnboardingEditor = true;
  state.tempOnboardPhoto = state.playerDossier?.player?.photoUrl || "";
  renderApp();
}

// ---Player & Admin Actions ---
function renderApp() {
  updateTopbarLabels();
  const root = document.getElementById("app-root");
  if (!root) return;

  // Preserve active input focus and cursor position across re-renders
  const activeEl = document.activeElement;
  const activeId = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") ? activeEl.id : null;
  let selStart = null;
  let selEnd = null;
  if (activeId) {
    try {
      selStart = activeEl.selectionStart;
      selEnd = activeEl.selectionEnd;
    } catch (_) {}
  }

  if (state.currentView === "rules") root.innerHTML = renderRulesView();
  else if (state.currentView === "player") root.innerHTML = renderPlayerView();
  else if (state.currentView === "board") root.innerHTML = renderBoardView();
  else if (state.currentView === "admin") root.innerHTML = renderAdminView();

  if (activeId) {
    const restored = document.getElementById(activeId);
    if (restored) {
      restored.focus();
      if (selStart !== null && selEnd !== null) {
        try {
          restored.setSelectionRange(selStart, selEnd);
        } catch (_) {}
      }
    }
  }
}

function toggleContractReveal() {
  state.isContractRevealed = !state.isContractRevealed;
  renderApp();
}

function togglePinReveal() {
  state.isPinRevealed = !state.isPinRevealed;
  renderApp();
}

async function handlePlayerLogin(e) {
  e.preventDefault();
  const playerId = document.getElementById("login-player-id")?.value;
  const pin = document.getElementById("login-player-pin")?.value;
  try {
    const dossier = await apiFetch("/api/player/login", {
      method: "POST",
      body: JSON.stringify({ playerId, pin })
    });
    state.playerDossier = dossier;
    state.playerToken = dossier.player.token;
    localStorage.setItem("killer_player_token", state.playerToken);
    if (dossier.player.lang) {
      state.lang = dossier.player.lang;
      localStorage.setItem("killer_lang", state.lang);
    }
    showToast(state.lang === "en" ? `Welcome Agent ${escapeHtml(dossier.player.name)}!` : `Bienvenue Agent ${escapeHtml(dossier.player.name)} !`, "success");
    renderApp();
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

function logoutPlayer() {
  state.playerToken = "";
  state.playerDossier = null;
  state.isContractRevealed = false;
  state.showOnboardingEditor = false;
  localStorage.removeItem("killer_player_token");
  if (window.location.pathname.startsWith("/p/")) {
    window.history.pushState({}, "", "/");
  }
  renderApp();
}

async function handleDeclareKill(e) {
  e.preventDefault();
  const victimPin = document.getElementById("victim-pin-input")?.value;
  try {
    const res = await apiFetch("/api/player/declare-kill", {
      method: "POST",
      body: JSON.stringify({ token: state.playerToken, victimPin })
    });
    state.playerDossier = res.dossier;
    showToast(state.lang === "en" ? "🗡️ Elimination confirmed! You inherited your new target and mission!" : "🗡️ Élimination confirmée ! Tu as récupéré ta nouvelle cible et ta nouvelle mission !", "success");
    await refreshData();
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleDeclareKillDirect() {
  const confirmMsg = state.lang === "en"
    ? "Confirm that you eliminated your target according to the scenario rules?"
    : "Confirmer que tu as bien éliminé ta cible selon les règles du scénario ?";
  if (!confirm(confirmMsg)) return;
  try {
    const res = await apiFetch("/api/player/declare-kill", {
      method: "POST",
      body: JSON.stringify({ token: state.playerToken })
    });
    state.playerDossier = res.dossier;
    showToast(state.lang === "en" ? "🗡️ Elimination confirmed! Here is your new contract!" : "🗡️ Élimination confirmée ! Voici ton nouveau contrat !", "success");
    await refreshData();
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleConfirmOwnDeath() {
  const confirmMsg = state.lang === "en"
    ? "Confirm that your assassin succeeded in their mission on you and that you are eliminated?"
    : "Confirmer que ton assassin a réussi sa mission sur toi et que tu es éliminé(e) ?";
  if (!confirm(confirmMsg)) return;
  try {
    const res = await apiFetch("/api/player/confirm-own-death", {
      method: "POST",
      body: JSON.stringify({ token: state.playerToken })
    });
    state.playerDossier = res.dossier;
    showToast(state.lang === "en" ? "💀 You confirmed your elimination with fair play." : "💀 Tu as confirmé ton élimination avec fair-play.", "gold");
    await refreshData();
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleCounterAttack(role) {
  const isEn = state.lang === "en";
  const msg = role === "assassin_compromised"
    ? (isEn ? "Confirm that your target guessed your exact mission out loud?" : "Confirmer que ta cible a deviné ta mission à voix haute avant de tomber dans le piège ?")
    : (isEn ? "Confirm that you unmasked your hunter by stating their exact mission?" : "Confirmer que tu as démasqué ton chasseur en énonçant sa mission exacte ?");
  if (!confirm(msg)) return;
  try {
    const res = await apiFetch("/api/player/counter-attack", {
      method: "POST",
      body: JSON.stringify({ token: state.playerToken, role })
    });
    state.playerDossier = res.dossier;
    showToast(escapeHtml(res.message), "gold");
    await refreshData();
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

// --- Admin Handlers ---
async function handleAdminLogin(e) {
  e.preventDefault();
  const password = document.getElementById("admin-password-input")?.value;
  try {
    const res = await apiFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password })
    });
    state.adminToken = res.token;
    localStorage.setItem("killer_admin_token", res.token);
    await refreshData();
    showToast("👑 Connecté en tant que Maître du Jeu !", "gold");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

function logoutAdmin() {
  state.adminToken = "";
  state.adminData = null;
  localStorage.removeItem("killer_admin_token");
  renderApp();
}

function switchAdminSubTab(tab) {
  state.adminSubTab = tab;
  renderApp();
}

function setGmFilter(filter) {
  state.gmPlayerFilter = filter;
  renderApp();
}

function updateDraftPlayer(idx, field, val) {
  if (state.draftPlayers[idx]) state.draftPlayers[idx][field] = val;
}

function addDraftPlayerRow() {
  state.draftPlayers.push({ name: "", phone: "" });
  renderApp();
}

function removeDraftPlayer(idx) {
  state.draftPlayers.splice(idx, 1);
  if (state.draftPlayers.length === 0) state.draftPlayers.push({ name: "", phone: "" });
  renderApp();
}

function loadCurrentGamePlayersIntoDraft() {
  const g = state.adminData?.game;
  if (!g || !g.players) return;
  state.draftPlayers = g.players.map(p => ({ name: p.name, phone: p.phone || "", photoUrl: p.photoUrl, lang: p.lang }));
  showToast("Joueurs actuels (avec leurs photos et langues) chargés !", "info");
  renderApp();
}

async function handleGenerateGame(mode = "active") {
  const valid = state.draftPlayers.filter(p => p.name && p.name.trim().length > 0);
  if (mode === "active" && valid.length < 3) {
    showToast("Il faut au moins 3 joueurs avec un prénom pour générer la boucle !");
    return;
  }
  if (mode === "lobby" && valid.length < 1) {
    showToast("Entre au moins 1 invité pour ouvrir le salon de prévalidation !");
    return;
  }
  try {
    await apiFetch("/api/admin/game/generate", {
      method: "POST",
      body: JSON.stringify({
        name: state.draftSettings.name,
        players: valid,
        counterAttackRule: state.draftSettings.counterAttackRule,
        killValidationMode: state.draftSettings.killValidationMode,
        difficultyFilter: state.draftSettings.difficultyFilter,
        mode
      })
    });
    state.sentQueueTracker.clear();
    state.adminSubTab = "live";
    await refreshData();
    if (mode === "lobby") {
      showToast("📩 Salon de Prévalidation ouvert ! Envoie les invitations aux joueurs.", "gold");
    } else {
      showToast("🎯 Partie générée ! Le Cercle et les missions sont prêts.", "success");
    }
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleQuickRandomScenario(playerId) {
  try {
    const res = await apiFetch("/api/admin/player/replace-scenario", {
      method: "POST",
      body: JSON.stringify({ playerId, mode: "random" })
    });
    await refreshData();
    showToast(`🎲 Nouveau scénario attribué à ${escapeHtml(res.player.name)} : « ${escapeHtml(res.player.scenario.title)} »`, "gold");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

function openReplaceScenarioModal(playerId) {
  const g = state.adminData?.game;
  const p = g?.players.find(x => x.id === playerId);
  if (!p) return;

  const scenariosOptions = (state.adminData.scenarios || [])
    .map(s => `<option value="${escapeHtml(s.id)}" ${p.scenario?.id === s.id ? "selected" : ""}>[${escapeHtml(s.difficulty)}] ${escapeHtml(s.title)} / ${escapeHtml(s.title_en || "")} — ${escapeHtml(s.description.slice(0, 55))}...</option>`)
    .join("");

  const modalRoot = document.getElementById("modal-root");
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal">
        <div class="card-header">
          <h3 class="card-title">🔄 Remplacer le Scénario de ${escapeHtml(p.name)}</h3>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
        </div>

        <div style="margin-bottom:1.1rem; padding-bottom:1rem; border-bottom:1px solid var(--border-subtle);">
          <label class="form-label">Option 1 : Choisir dans le catalogue (${state.adminData.scenarios.length} disponibles)</label>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <select id="modal-select-scenario" class="select" style="flex:1;">
              ${scenariosOptions}
            </select>
            <button class="btn btn-gold" onclick="submitSelectScenario('${escapeHtml(p.id)}')">✓ Appliquer</button>
          </div>
        </div>

        <div>
          <label class="form-label">Option 2 : Écrire un scénario sur-mesure (FR & EN optionnel)</label>
          <div class="grid-2">
            <div class="form-group">
              <input id="modal-custom-title" type="text" class="input" placeholder="🇫🇷 Titre" value="Mission Spéciale MJ" />
            </div>
            <div class="form-group">
              <input id="modal-custom-title-en" type="text" class="input" placeholder="🇬🇧 English Title" value="Special GM Mission" />
            </div>
          </div>
          <div class="form-group">
            <textarea id="modal-custom-desc" class="textarea" rows="2" placeholder="🇫🇷 Description de la mission en français..."></textarea>
          </div>
          <div class="form-group">
            <textarea id="modal-custom-desc-en" class="textarea" rows="2" placeholder="🇬🇧 Mission description in English (optional)..."></textarea>
          </div>
          <button class="btn btn-primary btn-block" onclick="submitCustomScenario('${escapeHtml(p.id)}')">
            ✍️ Assigner ce scénario sur-mesure
          </button>
        </div>
      </div>
    </div>
  `;
}

async function submitSelectScenario(playerId) {
  const scenarioId = document.getElementById("modal-select-scenario")?.value;
  try {
    await apiFetch("/api/admin/player/replace-scenario", {
      method: "POST",
      body: JSON.stringify({ playerId, mode: "select", scenarioId })
    });
    closeModal();
    await refreshData();
    showToast("✅ Scénario remplacé !", "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function submitCustomScenario(playerId) {
  const customTitle = document.getElementById("modal-custom-title")?.value;
  const customTitle_en = document.getElementById("modal-custom-title-en")?.value;
  const customDescription = document.getElementById("modal-custom-desc")?.value;
  const customDescription_en = document.getElementById("modal-custom-desc-en")?.value;
  try {
    await apiFetch("/api/admin/player/replace-scenario", {
      method: "POST",
      body: JSON.stringify({ playerId, mode: "custom", customTitle, customTitle_en, customDescription, customDescription_en })
    });
    closeModal();
    await refreshData();
    showToast("✍️ Scénario personnalisé assigné !", "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleForceKill(killerId, killerName, victimName) {
  if (!confirm(`Arbitrage MJ : Confirmer l'élimination de ${victimName} par ${killerName} ?`)) return;
  try {
    await apiFetch("/api/admin/game/force-kill", {
      method: "POST",
      body: JSON.stringify({ killerId })
    });
    await refreshData();
    showToast(`🗡️ Meurtre validé (${escapeHtml(killerName)} ➔ ${escapeHtml(victimName)}) !`, "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleUndoKill() {
  if (!confirm("Annuler le dernier meurtre et restaurer la victime dans la boucle ?")) return;
  try {
    await apiFetch("/api/admin/game/undo", { method: "POST" });
    await refreshData();
    showToast("⏪ Dernier meurtre annulé !", "gold");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleUpdateCounterRule(counterAttackRule) {
  try {
    await apiFetch("/api/admin/game/settings", {
      method: "POST",
      body: JSON.stringify({ counterAttackRule })
    });
    await refreshData();
    showToast("🛡️ Règle de contre-attaque mise à jour !", "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

function openAddLatePlayerModal() {
  const modalRoot = document.getElementById("modal-root");
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal">
        <div class="card-header">
          <h3 class="card-title">➕ Insérer un Joueur en Cours de Partie</h3>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
        </div>
        <div class="form-group">
          <label class="form-label">Prénom du joueur</label>
          <input id="late-player-name" type="text" class="input" placeholder="Ex: Thomas" />
        </div>
        <div class="form-group">
          <label class="form-label">Numéro de portable</label>
          <input id="late-player-phone" type="tel" class="input" placeholder="06 12 34 56 78" />
        </div>
        <div class="form-group">
          <label class="form-label">Langue du joueur</label>
          <select id="late-player-lang" class="select">
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
        <button class="btn btn-primary btn-block" onclick="submitAddLatePlayer()">➕ Insérer dans le Cercle</button>
      </div>
    </div>
  `;
}

async function submitAddLatePlayer() {
  const name = document.getElementById("late-player-name")?.value;
  const phone = document.getElementById("late-player-phone")?.value;
  const lang = document.getElementById("late-player-lang")?.value || "fr";
  try {
    await apiFetch("/api/admin/game/add-player", {
      method: "POST",
      body: JSON.stringify({ name, phone, lang })
    });
    closeModal();
    await refreshData();
    showToast("➕ Nouveau joueur inséré dans le Cercle !", "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

let tempAdminEditPhoto = "";

function openEditPlayerModal(playerId) {
  const p = state.adminData?.game?.players.find(x => x.id === playerId);
  if (!p) return;
  tempAdminEditPhoto = "";
  const modalRoot = document.getElementById("modal-root");
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal">
        <div class="card-header">
          <h3 class="card-title">✏️ Modifier ${escapeHtml(p.name)}</h3>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
        </div>
        <div style="text-align:center; margin-bottom:0.85rem;">
          <img id="admin-edit-photo-preview" src="${p.photoUrl || generateClientDefaultPhoto(p.name, 0)}" class="avatar-photo-lg" alt="${escapeHtml(p.name)}" />
          <div style="margin-top:0.5rem;">
            <label class="btn btn-ghost btn-sm" style="cursor:pointer;">
              📸 Changer la photo
              <input type="file" accept="image/*" style="display:none;" onchange="handleAdminEditPhotoFile(event)" />
            </label>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Prénom</label>
          <input id="edit-p-name" type="text" class="input" value="${escapeHtml(p.name)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Téléphone</label>
          <input id="edit-p-phone" type="tel" class="input" value="${escapeHtml(p.phone || '')}" />
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Code PIN (4 chiffres)</label>
            <input id="edit-p-pin" type="text" class="input" value="${escapeHtml(p.pin)}" />
          </div>
          <div class="form-group">
            <label class="form-label">Langue du joueur</label>
            <select id="edit-p-lang" class="select">
              <option value="fr" ${p.lang !== 'en' ? 'selected' : ''}>🇫🇷 Français</option>
              <option value="en" ${p.lang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary btn-block" onclick="submitEditPlayer('${escapeHtml(p.id)}')">💾 Enregistrer</button>
      </div>
    </div>
  `;
}

async function handleAdminEditPhotoFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    tempAdminEditPhoto = await resizeImageFile(file, 320);
    const imgEl = document.getElementById("admin-edit-photo-preview");
    if (imgEl) imgEl.src = tempAdminEditPhoto;
  } catch (_) {}
}

async function submitEditPlayer(playerId) {
  const name = document.getElementById("edit-p-name")?.value;
  const phone = document.getElementById("edit-p-phone")?.value;
  const pin = document.getElementById("edit-p-pin")?.value;
  const lang = document.getElementById("edit-p-lang")?.value;
  const payload = { playerId, name, phone, pin, lang };
  if (tempAdminEditPhoto) payload.photoUrl = tempAdminEditPhoto;
  try {
    await apiFetch("/api/admin/player/update", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    closeModal();
    await refreshData();
    showToast("Joueur mis à jour !", "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

// --- Google Contacts & API Key Handlers ---
async function handleSaveGoogleApiConfig() {
  const googleClientId = document.getElementById("google-client-id-input")?.value?.trim() || "";
  const googleApiKey = document.getElementById("google-api-key-input")?.value?.trim() || "";
  try {
    await apiFetch("/api/admin/comm/config", {
      method: "POST",
      body: JSON.stringify({ googleClientId, googleApiKey })
    });
    await refreshData();
    showToast("🔑 Clés API Google enregistrées avec succès !", "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

function parseGoogleContactsCsvOrVcf(text, filename = "") {
  const results = [];
  if (filename.toLowerCase().endsWith(".vcf") || text.includes("BEGIN:VCARD")) {
    const cards = text.split(/BEGIN:VCARD/i);
    for (const card of cards) {
      if (!card.trim()) continue;
      let name = "";
      let phone = "";
      const lines = card.split(/\r?\n/);
      for (const line of lines) {
        if (/^FN[;:]/i.test(line)) {
          name = line.split(":").slice(1).join(":").trim();
        } else if (!name && /^N[;:]/i.test(line)) {
          const parts = line.split(":").slice(1).join(":").split(";").filter(Boolean);
          name = parts.reverse().join(" ").trim();
        } else if (!phone && /^TEL[;:]/i.test(line)) {
          phone = line.split(":").slice(1).join(":").trim();
        }
      }
      if (name) results.push({ name, phone, source: "Google vCard" });
    }
    return results;
  }

  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return results;

  const splitCsvLine = (line) => {
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') inQuotes = !inQuotes;
      else if ((ch === "," || ch === ";") && !inQuotes) {
        out.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    out.push(cur.trim());
    return out;
  };

  const headers = splitCsvLine(lines[0]).map(h => h.toLowerCase());
  const nameIdx = headers.findIndex(h => h === "name" || h === "nom" || h === "display name");
  const firstIdx = headers.findIndex(h => h.includes("first name") || h.includes("given name") || h === "prénom" || h === "prenom");
  const lastIdx = headers.findIndex(h => h.includes("last name") || h.includes("family name") || h === "nom de famille");
  const phoneIndices = headers
    .map((h, i) => (h.includes("phone") || h.includes("téléphone") || h.includes("telephone") || h.includes("mobile") || h.includes("tel")) && !h.includes("type") ? i : -1)
    .filter(i => i >= 0);

  for (let r = 1; r < lines.length; r++) {
    const cols = splitCsvLine(lines[r]);
    let name = "";
    if (nameIdx >= 0 && cols[nameIdx]) name = cols[nameIdx];
    else {
      const fn = firstIdx >= 0 ? cols[firstIdx] || "" : "";
      const ln = lastIdx >= 0 ? cols[lastIdx] || "" : "";
      name = `${fn} ${ln}`.trim();
    }
    let phone = "";
    for (const pi of phoneIndices) {
      if (cols[pi] && /\d{6,}/.test(cols[pi].replace(/\s+/g, ""))) {
        phone = cols[pi].split(":::")[0].trim();
        break;
      }
    }
    if (!phone) {
      const found = cols.find(c => /^(\+33|0)[1-9][\d\s.\-]{7,}$/.test(c));
      if (found) phone = found;
    }
    if (name) results.push({ name, phone, source: "Google CSV" });
  }
  return results;
}

async function handleGoogleContactsFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = parseGoogleContactsCsvOrVcf(text, file.name);
    if (parsed.length === 0) {
      showToast("Aucun contact trouvé dans ce fichier. Vérifie qu'il s'agit bien d'un export Google CSV ou vCard (.vcf).");
      return;
    }
    await apiFetch("/api/admin/contacts/save", {
      method: "POST",
      body: JSON.stringify({ contacts: parsed, merge: true })
    });
    await refreshData();
    showToast(`📇 ${parsed.length} contact(s) Google importés !`, "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleGoogleOAuthSync() {
  const inputClientId = document.getElementById("google-client-id-input")?.value?.trim();
  const clientId = inputClientId || state.adminData?.commConfig?.googleClientId;
  if (!clientId) {
    showToast("Saisis d'abord ton Google OAuth Client ID dans le champ ci-dessus (ou utilise l'import fichier .csv / .vcf) !", "gold");
    return;
  }
  if (inputClientId && inputClientId !== state.adminData?.commConfig?.googleClientId) {
    await handleSaveGoogleApiConfig();
  }
  if (!window.google?.accounts?.oauth2) {
    showToast("Chargement du SDK Google Identity...");
    return;
  }
  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/contacts.other.readonly",
    callback: async (resp) => {
      if (resp.error) {
        showToast("Erreur Google OAuth : " + escapeHtml(resp.error));
        return;
      }
      try {
        let allConnections = [];
        let pageToken = "";
        do {
          const url = `https://people.googleapis.com/v1/people/me/connections?personFields=names,nicknames,organizations,phoneNumbers,emailAddresses,photos&pageSize=1000${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
          const peopleResp = await fetch(url, {
            headers: { Authorization: `Bearer ${resp.access_token}` }
          });
          const data = await peopleResp.json().catch(() => ({}));
          if (!peopleResp.ok) {
            const errMsg = data.error?.message || `HTTP ${peopleResp.status}`;
            showToast(`⚠️ Google People API refusée (${peopleResp.status}) : ${escapeHtml(errMsg)}`, "gold");
            // Open a helpful modal if People API is not enabled on the GCP project
            const modalRoot = document.getElementById("modal-root");
            if (modalRoot) {
              modalRoot.innerHTML = `
                <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
                  <div class="modal">
                    <div class="card-header">
                      <h3 class="card-title">⚠️ Activer l'API Google People (1 clic)</h3>
                      <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
                    </div>
                    <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:0.85rem;">
                      La connexion OAuth fonctionne, mais Google indique que le service <strong>Google People API</strong> n'est pas encore activé sur ton projet Google Cloud :
                    </p>
                    <div style="background:#0d1018; padding:0.75rem; border-radius:8px; font-size:0.8rem; color:#fda4af; margin-bottom:1rem;">
                      ${escapeHtml(errMsg)}
                    </div>
                    <a href="https://console.cloud.google.com/apis/library/people.googleapis.com" target="_blank" class="btn btn-gold btn-block" style="margin-bottom:0.65rem;">
                      🔗 1. Ouvrir Google Cloud & Cliquer sur « ACTIVER » (People API)
                    </a>
                    <button class="btn btn-primary btn-block" onclick="closeModal(); handleGoogleOAuthSync();">
                      🔄 2. Réessayer la Synchronisation
                    </button>
                  </div>
                </div>
              `;
            }
            return;
          }
          if (Array.isArray(data.connections)) {
            allConnections.push(...data.connections);
          }
          pageToken = data.nextPageToken || "";
        } while (pageToken);

        // Also fetch "Other Contacts" in case contacts are stored there
        try {
          const otherResp = await fetch("https://people.googleapis.com/v1/otherContacts?readMask=names,phoneNumbers,emailAddresses,photos&pageSize=1000", {
            headers: { Authorization: `Bearer ${resp.access_token}` }
          });
          if (otherResp.ok) {
            const otherData = await otherResp.json().catch(() => ({}));
            if (Array.isArray(otherData.otherContacts)) {
              allConnections.push(...otherData.otherContacts);
            }
          }
        } catch (_) {}

        const contacts = allConnections.map(p => {
          const dispName =
            p.names?.[0]?.displayName ||
            [p.names?.[0]?.givenName, p.names?.[0]?.familyName].filter(Boolean).join(" ") ||
            p.nicknames?.[0]?.value ||
            p.organizations?.[0]?.name ||
            p.emailAddresses?.[0]?.value?.split("@")[0] ||
            p.phoneNumbers?.[0]?.value ||
            "";
          return {
            name: dispName.trim(),
            phone: p.phoneNumbers?.[0]?.value || p.phoneNumbers?.[0]?.canonicalForm || "",
            email: p.emailAddresses?.[0]?.value || "",
            photoUrl: p.photos?.[0]?.url || "",
            source: "Google OAuth"
          };
        }).filter(c => c.name);

        if (contacts.length === 0) {
          showToast("⚠️ Ton compte Google connecté ne contient aucun contact enregistré dans Google Contacts (contacts.google.com).", "gold");
          return;
        }

        await apiFetch("/api/admin/contacts/save", {
          method: "POST",
          body: JSON.stringify({ contacts, merge: true })
        });
        await refreshData();
        showToast(`📇 ${contacts.length} contacts synchronisés depuis Google !`, "success");
      } catch (err) {
        showToast("Erreur Google People API : " + escapeHtml(err.message));
      }
    }
  });
  tokenClient.requestAccessToken();
}

async function handleNativeContactPicker() {
  if (!("contacts" in navigator && "ContactsManager" in window)) {
    showToast("Le sélecteur natif est disponible sur smartphone (Chrome Android / iOS). Sur PC, utilise la synchro Google API ou l'import CSV/vCard !", "gold");
    return;
  }
  try {
    const picked = await navigator.contacts.select(["name", "tel"], { multiple: true });
    if (!picked || picked.length === 0) return;
    const formatted = picked.map(c => ({
      name: c.name?.[0] || "Joueur",
      phone: c.tel?.[0] || "",
      source: "Mobile Contacts"
    }));
    await apiFetch("/api/admin/contacts/save", {
      method: "POST",
      body: JSON.stringify({ contacts: formatted, merge: true })
    });
    await refreshData();
    showToast(`📱 ${formatted.length} contact(s) importés !`, "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

function toggleSelectContact(id, checked) {
  if (checked) state.selectedContactIds.add(id);
  else state.selectedContactIds.delete(id);
  const btn = document.getElementById("add-selected-contacts-btn");
  if (btn) {
    btn.textContent = `➕ Ajouter les contacts cochés (${state.selectedContactIds.size}) à la partie`;
  } else {
    renderApp();
  }
}

function addSelectedContactsToDraft() {
  const contacts = state.adminData?.contacts || [];
  const chosen = contacts.filter(c => state.selectedContactIds.has(c.id));
  if (chosen.length === 0) {
    showToast("Coche d'abord au moins un contact dans la liste !");
    return;
  }
  state.draftPlayers = state.draftPlayers.filter(p => p.name.trim().length > 0);
  for (const c of chosen) {
    if (!state.draftPlayers.some(p => p.name.toLowerCase() === c.name.toLowerCase())) {
      state.draftPlayers.push({ name: c.name, phone: c.phone || "", photoUrl: c.photoUrl || "" });
    }
  }
  state.selectedContactIds.clear();
  showToast(`✅ ${chosen.length} joueur(s) ajoutés à la partie !`, "success");
  renderApp();
}

async function clearAllContacts() {
  if (!confirm("Vider le carnet de contacts enregistré ?")) return;
  await apiFetch("/api/admin/contacts/all", { method: "DELETE" });
  await refreshData();
}

// --- Brevo SMS Config & Live Test Handlers ---
async function handleSaveBrevoConfig(e) {
  e.preventDefault();
  const brevoApiKey = document.getElementById("brevo-api-key-input")?.value?.trim() || "";
  const brevoSender = document.getElementById("brevo-sender-input")?.value?.trim() || "KILLER";
  const autoSendOnStart = !!document.getElementById("brevo-auto-start")?.checked;
  const autoSendOnScenarioChange = !!document.getElementById("brevo-auto-scenario")?.checked;
  const autoSendOnKill = !!document.getElementById("brevo-auto-kill")?.checked;

  try {
    await apiFetch("/api/admin/comm/config", {
      method: "POST",
      body: JSON.stringify({
        preferredChannel: "sms_external",
        externalProvider: "brevo",
        brevoApiKey,
        brevoSender,
        autoSendOnStart,
        autoSendOnScenarioChange,
        autoSendOnKill
      })
    });
    const check = await apiFetch("/api/admin/comm/check-brevo", {
      method: "POST",
      body: JSON.stringify({ brevoApiKey })
    });
    state.brevoCheckStatus = check;
    await refreshData();
    showToast(`✅ Clé API Brevo validée ! Compte : ${escapeHtml(check.email)}`, "success");
  } catch (err) {
    await refreshData();
    showToast(escapeHtml(err.message));
  }
}

async function handleTestBrevoSms(e) {
  e.preventDefault();
  const phone = document.getElementById("test-sms-phone")?.value?.trim();
  const message = document.getElementById("test-sms-message")?.value?.trim();
  const brevoApiKey = document.getElementById("brevo-api-key-input")?.value?.trim();
  const brevoSender = document.getElementById("brevo-sender-input")?.value?.trim();

  try {
    const res = await apiFetch("/api/admin/comm/test-sms", {
      method: "POST",
      body: JSON.stringify({ phone, message, brevoApiKey, brevoSender, provider: "brevo" })
    });
    await refreshData();
    showToast(`🚀 SMS de test envoyé avec succès ! (${escapeHtml(res.log.detail)})`, "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

function markQueueSent(playerId) {
  state.sentQueueTracker.add(playerId);
  setTimeout(() => renderApp(), 200);
}

async function handleSendSingleExternalSms(playerId, template = "start") {
  const g = state.adminData?.game;
  const p = g?.players.find(x => x.id === playerId);
  if (!p) return;
  const message = buildPlayerCustomMessage(p, g, template);
  try {
    const res = await apiFetch("/api/admin/comm/send-external", {
      method: "POST",
      body: JSON.stringify({ playerId: p.id, phone: p.phone, playerName: p.name, message })
    });
    state.sentQueueTracker.add(p.id);
    await refreshData();
    showToast(`🚀 SMS envoyé à ${escapeHtml(p.name)} (${escapeHtml(res.log.detail)}) !`, "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleBulkExternalSms(template = "start") {
  const g = state.adminData?.game;
  if (!g) return;
  const withPhone = g.status === "lobby"
    ? g.players.filter(p => p.phone && p.rsvpStatus !== "declined")
    : g.players.filter(p => p.alive && p.phone);
  if (withPhone.length === 0) {
    showToast("Aucun joueur éligible n'a de numéro de téléphone renseigné !");
    return;
  }
  const label = (g.status === "lobby" || template === "invite") ? "d'invitation / prévalidation" : "de mission";
  if (!confirm(`Envoyer un SMS Brevo ${label} aux ${withPhone.length} joueurs ayant un numéro ?`)) return;

  let okCount = 0;
  for (const p of withPhone) {
    try {
      const message = buildPlayerCustomMessage(p, g, template);
      await apiFetch("/api/admin/comm/send-external", {
        method: "POST",
        body: JSON.stringify({ playerId: p.id, phone: p.phone, playerName: p.name, message })
      });
      state.sentQueueTracker.add(p.id);
      okCount++;
    } catch (err) {
      showToast(`Erreur pour ${escapeHtml(p.name)} : ${escapeHtml(err.message)}`);
    }
  }
  await refreshData();
  if (okCount > 0) showToast(`🚀 ${okCount}/${withPhone.length} SMS envoyés avec succès !`, "success");
}

function openSmsQrModal(playerId) {
  const g = state.adminData?.game;
  const p = g?.players.find(x => x.id === playerId);
  if (!p) return;
  const msg = buildPlayerCustomMessage(p, g, "start");
  const smsUri = getSmsUri(p.phone, msg);
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(smsUri)}`;

  const modalRoot = document.getElementById("modal-root");
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal" style="text-align:center;">
        <div class="card-header">
          <h3 class="card-title">📱 QR Code SMS — ${escapeHtml(p.name)}</h3>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
        </div>
        <div style="background:#fff; padding:0.85rem; border-radius:12px; display:inline-block; margin-bottom:0.85rem;">
          <img src="${escapeHtml(qrImgUrl)}" alt="QR SMS" width="200" height="200" />
        </div>
        <div style="text-align:left; background:#0d1018; padding:0.75rem; border-radius:8px; font-size:0.8rem; white-space:pre-wrap; margin-bottom:0.85rem;">${escapeHtml(msg)}</div>
        <button class="btn btn-primary btn-block" onclick="copyText(${JSON.stringify(msg)}, 'Message copié !')">
          📋 Copier le texte du message
        </button>
      </div>
    </div>
  `;
}

function openBroadcastModal() {
  const modalRoot = document.getElementById("modal-root");
  modalRoot.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) closeModal()">
      <div class="modal">
        <div class="card-header">
          <h3 class="card-title">📢 Envoyer une Annonce (FR / EN)</h3>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
        </div>
        <div class="form-group">
          <label class="form-label">🇫🇷 Message en Français</label>
          <textarea id="broadcast-text" class="textarea" rows="2" placeholder="Ex: Attention, il ne reste plus que 4 survivants !"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">🇬🇧 Message in English (optionnel)</label>
          <textarea id="broadcast-text-en" class="textarea" rows="2" placeholder="Ex: Watch out, only 4 survivors left!"></textarea>
        </div>
        <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; font-size:0.84rem; cursor:pointer;">
          <input id="broadcast-external-sms" type="checkbox" />
          Envoyer aussi par SMS Brevo à tous les joueurs vivants
        </label>
        <button class="btn btn-primary btn-block" onclick="submitBroadcast()">📢 Diffuser l'annonce</button>
      </div>
    </div>
  `;
}

async function submitBroadcast() {
  const text = document.getElementById("broadcast-text")?.value;
  const text_en = document.getElementById("broadcast-text-en")?.value;
  const sendExternal = !!document.getElementById("broadcast-external-sms")?.checked;
  try {
    await apiFetch("/api/admin/comm/announce", {
      method: "POST",
      body: JSON.stringify({ targetPlayerId: "all", text, text_en, sendExternal })
    });
    closeModal();
    await refreshData();
    showToast("📢 Annonce diffusée !", "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleAddScenario(e) {
  e.preventDefault();
  const title = document.getElementById("new-sc-title")?.value;
  const title_en = document.getElementById("new-sc-title-en")?.value;
  const category = document.getElementById("new-sc-cat")?.value;
  const difficulty = document.getElementById("new-sc-diff")?.value;
  const description = document.getElementById("new-sc-desc")?.value;
  const description_en = document.getElementById("new-sc-desc-en")?.value;
  try {
    await apiFetch("/api/admin/scenarios/add", {
      method: "POST",
      body: JSON.stringify({ title, title_en, category, difficulty, description, description_en })
    });
    await refreshData();
    showToast("➕ Nouveau scénario ajouté !", "success");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

async function handleDeleteScenario(id) {
  if (!confirm("Supprimer ce scénario du catalogue ?")) return;
  try {
    await apiFetch(`/api/admin/scenarios/${encodeURIComponent(id)}`, { method: "DELETE" });
    await refreshData();
    showToast("Scénario supprimé.", "info");
  } catch (err) {
    showToast(escapeHtml(err.message));
  }
}

function closeModal() {
  const modalRoot = document.getElementById("modal-root");
  if (modalRoot) modalRoot.innerHTML = "";
}

function copyText(txt, toastMsg = "Copié !") {
  navigator.clipboard?.writeText(txt);
  showToast(toastMsg, "success");
}

function connectSSE() {
  try {
    const es = new EventSource("/api/events");
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === "game_updated" || data.type === "announcement") {
          refreshData();
          if (data.type === "announcement") {
            const msg = state.lang === "en" ? (data.payload?.text_en || data.payload?.text) : data.payload?.text;
            if (msg) showToast(`📢 GM : ${escapeHtml(msg)}`, "gold");
          }
        }
      } catch (_) {}
    };
  } catch (_) {}
}

window.addEventListener("DOMContentLoaded", async () => {
  updateTopbarLabels();
  const pathMatch = window.location.pathname.match(/^\/p\/([a-zA-Z0-9_-]+)/);
  if (pathMatch && pathMatch[1]) {
    if (state.playerToken !== pathMatch[1]) {
      localStorage.removeItem("killer_lang_manual");
    }
    state.playerToken = pathMatch[1];
    localStorage.setItem("killer_player_token", state.playerToken);
    state.currentView = "player";
    document.querySelectorAll(".nav-tab").forEach(btn => btn.classList.remove("active"));
    document.getElementById("tab-player")?.classList.add("active");
  } else if (window.location.pathname === "/admin") {
    state.currentView = "admin";
    document.querySelectorAll(".nav-tab").forEach(btn => btn.classList.remove("active"));
    document.getElementById("tab-admin")?.classList.add("active");
  }

  await refreshData();
  connectSSE();
});
