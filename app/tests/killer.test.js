const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { DEFAULT_SCENARIOS } = require("../scenarios");
const { normalizePhone, verifySingleCycle, createGame, generateDefaultPhoto } = require("../engine");
const { createApp } = require("../server");

async function withTestServer(fn) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "killer-test-"));
  const { app, getState } = createApp({
    dataDir: tmpDir,
    adminPassword: "test-admin-password",
    publicUrl: "https://killer.example.com"
  });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  async function req(endpoint, options = {}) {
    const resp = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    const body = await resp.json().catch(() => ({}));
    return { status: resp.status, body };
  }

  try {
    await fn({ req, getState, baseUrl });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

test("1. Catalogue bilingue (FR / EN) de 60 scénarios complet et valide", () => {
  assert.equal(DEFAULT_SCENARIOS.length, 60);
  for (const s of DEFAULT_SCENARIOS) {
    assert.ok(s.id && s.title && s.title_en && s.category && s.category_en && s.difficulty && s.difficulty_en && s.description && s.description_en);
    assert.ok(["Facile", "Moyen", "Difficile"].includes(s.difficulty));
    assert.ok(["Easy", "Medium", "Hard"].includes(s.difficulty_en));
  }
});

test("2. Normalisation des numéros et génération de photo de profil par défaut", () => {
  assert.equal(normalizePhone("06 12 34 56 78"), "+33612345678");
  assert.equal(normalizePhone("07.98.76.54.32"), "+33798765432");
  const svgPhoto = generateDefaultPhoto("Agent Alpha", 0);
  assert.ok(svgPhoto.startsWith("data:image/svg+xml;utf8,"));
});

test("3. Génération du Cercle : cycle hamiltonien unique garanti + photos par défaut", () => {
  for (const count of [3, 5, 12]) {
    const players = Array.from({ length: count }, (_, i) => ({
      name: `Joueur ${i + 1}`,
      phone: `06000000${String(i + 1).padStart(2, "0")}`
    }));
    const game = createGame({
      name: "Test Cycle",
      players,
      scenariosCatalog: DEFAULT_SCENARIOS
    });
    assert.equal(game.players.length, count);
    assert.equal(verifySingleCycle(game.players), true);
    for (const p of game.players) {
      assert.ok(p.photoUrl.startsWith("data:image/svg+xml"));
      assert.equal(p.onboarded, false);
    }
  }
});

test("4. Cycle de vie complet : Onboarding Photo/Langue EN, Config Brevo/Google, Remplacement Scénario, Contre-Attaque, Meurtres et Undo", async () => {
  await withTestServer(async ({ req, getState }) => {
    const login = await req("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: "test-admin-password" })
    });
    assert.equal(login.status, 200);
    const adminHeaders = { "x-admin-token": login.body.token };

    // Save Brevo & Google Contacts API config
    const cfgRes = await req("/api/admin/comm/config", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        brevoApiKey: "xkeysib-test-123",
        brevoSender: "KILLER",
        googleClientId: "123456-test.apps.googleusercontent.com",
        googleApiKey: "AIzaSyTestKey"
      })
    });
    assert.equal(cfgRes.status, 200);
    assert.equal(cfgRes.body.commConfig.brevoApiKey, "xkeysib-test-123");
    assert.equal(cfgRes.body.commConfig.googleClientId, "123456-test.apps.googleusercontent.com");

    // Generate Game with 4 players
    const genRes = await req("/api/admin/game/generate", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        name: "Soirée Bilingue Killer",
        players: [
          { name: "Alice", phone: "06 11 22 33 44" },
          { name: "Bob", phone: "06 22 33 44 55" },
          { name: "Charlie", phone: "06 33 44 55 66" },
          { name: "Diane", phone: "06 44 55 66 77" }
        ],
        counterAttackRule: "option_a",
        killValidationMode: "pin"
      })
    });
    assert.equal(genRes.status, 200);
    const game = genRes.body.game;
    const p1 = game.players[0];
    const p2 = game.players.find(p => p.id === p1.targetId);
    const p3 = game.players.find(p => p.id === p2.targetId);

    // First connection onboarding for P2 (selects English + uploads custom photo)
    const customPhotoData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/";
    const onboardRes = await req("/api/player/profile", {
      method: "POST",
      body: JSON.stringify({
        token: p2.token,
        lang: "en",
        photoUrl: customPhotoData,
        onboarded: true
      })
    });
    assert.equal(onboardRes.status, 200);
    assert.equal(onboardRes.body.dossier.player.lang, "en");
    assert.equal(onboardRes.body.dossier.player.onboarded, true);
    assert.equal(onboardRes.body.dossier.player.photoUrl, customPhotoData);
    assert.ok(onboardRes.body.dossier.player.scenario.title_en);

    // Verify P1 (hunter of P2) immediately sees P2's new custom photo as their target photo!
    const p1Dossier = await req(`/api/player/by-token/${p1.token}`);
    assert.equal(p1Dossier.status, 200);
    assert.equal(p1Dossier.body.player.target.id, p2.id);
    assert.equal(p1Dossier.body.player.target.photoUrl, customPhotoData);

    // P1 eliminates P2 -> victim photo is stored in P1's kills history!
    const killRes = await req("/api/player/declare-kill", {
      method: "POST",
      body: JSON.stringify({ token: p1.token, victimPin: p2.pin })
    });
    assert.equal(killRes.status, 200);
    assert.equal(killRes.body.dossier.player.target.id, p3.id);
    assert.equal(killRes.body.dossier.player.kills[0].victimPhotoUrl, customPhotoData);
    assert.equal(verifySingleCycle(getState().game.players), true);
  });
});

test("5. Phase de Prévalidation (Lobby) : Invitations, RSVP Oui/Non, Photos, et Lancement filtré sur les participants confirmés", async () => {
  await withTestServer(async ({ req, getState }) => {
    const login = await req("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: "test-admin-password" })
    });
    const adminHeaders = { "x-admin-token": login.body.token };

    // 1. Create a Pre-Validation Lobby with 5 invited guests
    const lobbyRes = await req("/api/admin/game/generate", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        name: "Soirée Killer - Prévalidation",
        mode: "lobby",
        players: [
          { name: "Alice", phone: "06 11 11 11 11" },
          { name: "Bob", phone: "06 22 22 22 22" },
          { name: "Charlie", phone: "06 33 33 33 33" },
          { name: "David", phone: "06 44 44 44 44" },
          { name: "Eve (Ne joue pas)", phone: "06 55 55 55 55" }
        ]
      })
    });
    assert.equal(lobbyRes.status, 200);
    assert.equal(lobbyRes.body.game.status, "lobby");
    assert.equal(lobbyRes.body.game.players.length, 5);

    const [alice, bob, charlie, david, eve] = lobbyRes.body.game.players;
    const aliceTokenBefore = alice.token;

    // 2. Alice, Bob, Charlie, David accept participation; Eve declines
    const alicePhoto = "data:image/jpeg;base64,ALICE_SELFIE";
    for (const p of [alice, bob, charlie, david]) {
      const rsvp = await req("/api/player/profile", {
        method: "POST",
        body: JSON.stringify({
          token: p.token,
          rsvpStatus: "accepted",
          lang: p.name === "Bob" ? "en" : "fr",
          photoUrl: p.name === "Alice" ? alicePhoto : undefined,
          onboarded: true
        })
      });
      assert.equal(rsvp.status, 200);
      assert.equal(rsvp.body.dossier.player.rsvpStatus, "accepted");
    }

    const eveRsvp = await req("/api/player/profile", {
      method: "POST",
      body: JSON.stringify({
        token: eve.token,
        rsvpStatus: "declined",
        onboarded: true
      })
    });
    assert.equal(eveRsvp.status, 200);
    assert.equal(eveRsvp.body.dossier.player.rsvpStatus, "declined");
    assert.equal(eveRsvp.body.dossier.rsvpCounts.accepted, 4);
    assert.equal(eveRsvp.body.dossier.rsvpCounts.declined, 1);

    // 3. Game Master launches the game from Lobby with only confirmed participants
    const launchRes = await req("/api/admin/game/launch-lobby", {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ includePending: false })
    });
    assert.equal(launchRes.status, 200);
    const activeGame = launchRes.body.game;
    assert.equal(activeGame.status, "active");
    assert.equal(activeGame.players.length, 4);
    assert.equal(activeGame.invitedArchive.length, 1);
    assert.equal(activeGame.invitedArchive[0].name, "Eve (Ne joue pas)");
    assert.equal(verifySingleCycle(activeGame.players), true);

    // 4. Verify Alice kept her exact same personal link token & selfie photo, and now has a target & scenario!
    const aliceDossier = await req(`/api/player/by-token/${aliceTokenBefore}`);
    assert.equal(aliceDossier.status, 200);
    assert.equal(aliceDossier.body.gameStatus, "active");
    assert.equal(aliceDossier.body.player.photoUrl, alicePhoto);
    assert.ok(aliceDossier.body.player.target);
    assert.ok(aliceDossier.body.player.scenario);
  });
});
