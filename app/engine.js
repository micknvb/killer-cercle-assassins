const crypto = require("crypto");

const AVATARS = ["🕵️", "🥷", "🎭", "🦊", "🐺", "🐍", "🦅", "🦂", "🦇", "🐆", "🎩", "🕶️", "🗡️", "🍷", "🃏", "♟️"];

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

function getInitials(name) {
  const parts = String(name || "Agent").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AG";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function generateDefaultPhoto(name = "Agent", idx = 0) {
  const theme = PORTRAIT_THEMES[idx % PORTRAIT_THEMES.length];
  const initials = getInitials(name).replace(/[<>&"']/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bg1}"/>
        <stop offset="100%" stop-color="${theme.bg2}"/>
      </linearGradient>
    </defs>
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

function generateToken(bytes = 6) {
  return crypto.randomBytes(bytes).toString("hex");
}

function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function normalizePhone(raw) {
  if (!raw) return "";
  let cleaned = String(raw).replace(/[^\d+]/g, "");
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "+33" + cleaned.slice(1);
  } else if (cleaned.startsWith("33") && cleaned.length === 11) {
    cleaned = "+" + cleaned;
  } else if (!cleaned.startsWith("+") && cleaned.length >= 9) {
    cleaned = "+" + cleaned;
  }
  return cleaned;
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandomScenario(scenariosCatalog, usedIds = new Set(), difficultyFilter = "all") {
  let pool = scenariosCatalog.filter(s => {
    if (difficultyFilter === "easy") return s.difficulty === "Facile";
    if (difficultyFilter === "easy_medium") return s.difficulty === "Facile" || s.difficulty === "Moyen";
    if (difficultyFilter === "medium_hard") return s.difficulty === "Moyen" || s.difficulty === "Difficile";
    return true;
  });
  if (pool.length === 0) pool = [...scenariosCatalog];
  let unused = pool.filter(s => !usedIds.has(s.id));
  if (unused.length === 0) unused = pool;
  const chosen = unused[Math.floor(Math.random() * unused.length)];
  return { ...chosen };
}

function verifySingleCycle(players) {
  const alive = players.filter(p => p.alive);
  if (alive.length <= 1) return true;
  const byId = new Map(alive.map(p => [p.id, p]));
  const visited = new Set();
  let curr = alive[0];
  while (curr && !visited.has(curr.id)) {
    visited.add(curr.id);
    if (curr.targetId === curr.id) return false;
    curr = byId.get(curr.targetId);
  }
  return visited.size === alive.length && curr && curr.id === alive[0].id;
}

/**
 * Creates a Pre-Validation Lobby (`status: 'lobby'`) or an immediately active game (`status: 'active'`).
 * In `lobby` mode, invitees can RSVP (`pending` | `accepted` | `declined`), upload their photo,
 * choose their language, and read the rules before the GM launches the circle with accepted players.
 */
function createGame({
  name = "Soirée Cercle des Assassins",
  players = [],
  scenariosCatalog = [],
  counterAttackRule = "option_a",
  killValidationMode = "pin",
  difficultyFilter = "all",
  mode = "active" // 'lobby' | 'active'
}) {
  const validPlayers = players
    .map(p => ({
      name: String(p.name || "").trim(),
      phone: normalizePhone(p.phone || ""),
      photoUrl: p.photoUrl || "",
      lang: p.lang || "fr",
      rsvpStatus: p.rsvpStatus || (mode === "lobby" ? "pending" : "accepted")
    }))
    .filter(p => p.name.length > 0);

  if (mode === "active" && validPlayers.length < 3) {
    throw new Error("Il faut au minimum 3 joueurs pour former un Cercle d'Assassins.");
  }
  if (mode === "lobby" && validPlayers.length < 1) {
    throw new Error("Ajoute au moins 1 invité pour ouvrir la phase de prévalidation.");
  }

  const baseList = mode === "active" ? shuffleArray(validPlayers) : validPlayers;
  const usedScenarioIds = new Set();

  const gamePlayers = baseList.map((p, idx) => {
    const scenario = mode === "active"
      ? pickRandomScenario(scenariosCatalog, usedScenarioIds, difficultyFilter)
      : null;
    if (scenario) usedScenarioIds.add(scenario.id);

    return {
      id: `p-${idx + 1}-${generateToken(3)}`,
      circleOrder: idx + 1,
      name: p.name,
      phone: p.phone,
      avatar: AVATARS[idx % AVATARS.length],
      photoUrl: p.photoUrl || generateDefaultPhoto(p.name, idx),
      hasCustomPhoto: Boolean(p.photoUrl),
      lang: p.lang || "fr",
      rsvpStatus: p.rsvpStatus, // 'pending' | 'accepted' | 'declined'
      rsvpUpdatedAt: null,
      onboarded: false,
      pin: generatePin(),
      token: generateToken(6),
      alive: mode === "active",
      targetId: null,
      scenario,
      scenarioHistory: [],
      kills: [],
      killedBy: null,
      immunityUntil: null
    };
  });

  if (mode === "active") {
    for (let i = 0; i < gamePlayers.length; i++) {
      const nextIdx = (i + 1) % gamePlayers.length;
      gamePlayers[i].targetId = gamePlayers[nextIdx].id;
    }
  }

  const now = new Date().toISOString();
  return {
    id: `game-${generateToken(4)}`,
    name,
    status: mode === "lobby" ? "lobby" : "active",
    createdAt: now,
    startedAt: mode === "active" ? now : null,
    finishedAt: null,
    settings: {
      counterAttackRule,
      killValidationMode,
      difficultyFilter
    },
    players: gamePlayers,
    invitedArchive: [], // stores declined/non-participating invitees once game starts
    killLog: [],
    announcements: [
      {
        id: generateToken(4),
        targetPlayerId: "all",
        text: mode === "lobby"
          ? `🎟️ Prévalidation ouverte pour "${name}" ! Confirmez votre participation, ajoutez votre photo de profil et découvrez les règles avant le lancement.`
          : `Bienvenue dans "${name}" ! Prenez connaissance de votre cible secrète et de votre mission. Que le meilleur assassin l'emporte !`,
        text_en: mode === "lobby"
          ? `🎟️ Pre-registration open for "${name}"! Confirm your participation, upload your profile photo, and read the rules before kickoff.`
          : `Welcome to "${name}"! Check your secret target and your mission. May the best assassin win!`,
        timestamp: now
      }
    ],
    undoStack: [],
    winner: null
  };
}

/**
 * Transitions a `lobby` game into an `active` game using only confirmed participants
 * (preserving their personal `/p/<token>`, PIN, photo, and language!).
 */
function launchFromLobby(game, scenariosCatalog = [], options = {}) {
  const { includePending = false } = options;
  const participating = game.players.filter(p =>
    p.rsvpStatus === "accepted" || (includePending && p.rsvpStatus === "pending")
  );
  const nonParticipating = game.players.filter(p => !participating.includes(p));

  if (participating.length < 3) {
    throw new Error(
      `Il faut au minimum 3 participants confirmés pour lancer le Cercle (actuellement : ${participating.length}).`
    );
  }

  const shuffled = shuffleArray(participating);
  const usedScenarioIds = new Set();

  shuffled.forEach((p, idx) => {
    const sc = pickRandomScenario(scenariosCatalog, usedScenarioIds, game.settings.difficultyFilter);
    usedScenarioIds.add(sc.id);
    p.circleOrder = idx + 1;
    p.rsvpStatus = "accepted";
    p.alive = true;
    p.scenario = sc;
    p.kills = [];
    p.killedBy = null;
  });

  for (let i = 0; i < shuffled.length; i++) {
    const nextIdx = (i + 1) % shuffled.length;
    shuffled[i].targetId = shuffled[nextIdx].id;
  }

  const now = new Date().toISOString();
  game.invitedArchive = nonParticipating.map(np => ({
    id: np.id,
    name: np.name,
    phone: np.phone,
    photoUrl: np.photoUrl,
    rsvpStatus: np.rsvpStatus,
    lang: np.lang
  }));
  game.players = shuffled;
  game.status = "active";
  game.startedAt = now;
  game.announcements = game.announcements || [];
  game.announcements.unshift({
    id: generateToken(4),
    targetPlayerId: "all",
    text: `🚀 La chasse est officiellement ouverte ! ${shuffled.length} agents participent. Découvrez votre Cible et votre Mission secrète !`,
    text_en: `🚀 The hunt has officially begun! ${shuffled.length} agents are in the circle. Check your secret Target and Mission!`,
    timestamp: now
  });

  return game;
}

module.exports = {
  AVATARS,
  PORTRAIT_THEMES,
  generateDefaultPhoto,
  generateToken,
  generatePin,
  normalizePhone,
  shuffleArray,
  pickRandomScenario,
  verifySingleCycle,
  createGame,
  launchFromLobby
};
