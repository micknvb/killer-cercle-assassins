# AGENTS.md — Architecture & Guide de Développement ("Le Cercle des Assassins")

Ce dépôt contient l'application web complète du **Jeu du Killer (Le Cercle des Assassins)**, conçue pour être déployée via Docker derrière un reverse-proxy (Caddy / Nginx / Traefik) ou exécutée localement avec Node.js.

## 1. Architecture Modulaire

```text
KillerGame/
├── README.md                 # Documentation complète d'installation, d'utilisation et d'architecture
├── AGENTS.md                 # Guide technique pour le développement et les agents IA
├── LICENSE                   # Licence MIT
├── .gitignore                # Exclut .env, data/, node_modules/ et tout fichier sensible
├── .env.example              # Modèle des variables d'environnement (ADMIN_PASSWORD, PUBLIC_URL, PORT)
├── docker-compose.yml        # Définition du service Docker (port 127.0.0.1:3099:3000 + réseau caddy_net)
├── deploy.sh                 # Script 1-clic : build Docker, exécute les tests automatisés et déploie
└── app/
    ├── Dockerfile            # Image légère node:20-alpine
    ├── package.json          # Scripts `npm start` et `npm test`
    ├── scenarios.js          # Catalogue bilingue (FR/EN) de 60 scénarios classés par catégorie et difficulté
    ├── engine.js             # Moteur logique pur (cycle hamiltonien, salon de prévalidation, héritage)
    ├── server.js             # API Express + SSE Temps Réel + Connecteurs SMS & Contacts (createApp exporté)
    ├── public/
    │   ├── index.html        # Shell HTML5 responsive + Illustrations SVG vectorielles
    │   ├── styles.css        # Design System sombre "Agence Secrète / Cercle des Assassins" (Mobile-first)
    │   └── app.js            # SPA Frontend bilingue FR/EN (Règles, Salon Prévalidation, Contrat, Survivants, MJ)
    └── tests/
        └── killer.test.js    # Suite de tests automatisés (unitaires + intégration API bout-en-bout)
```

## 2. Commandes de Test & Déploiement Rapide

- **Exécuter les tests localement** :
  ```bash
  cd app && npm test
  ```
- **Construire, tester dans le conteneur et déployer en production** :
  ```bash
  ./deploy.sh
  ```

## 3. Invariants Métier Critiques (À préserver lors des évolutions)
1. **Unicité de la boucle (`verifySingleCycle` dans `engine.js`)** : Tous les joueurs vivants d'une partie active doivent toujours former **un unique cycle hamiltonien fermé** (`A -> B -> C -> A`). Aucune sous-boucle isolée ne doit pouvoir exister.
2. **Phase de Prévalidation (`status === 'lobby'` & `launchFromLobby`)** : Permet d'inviter une liste d'invités, de récolter leur confirmation (`accepted` / `declined`), leur langue (`fr` / `en`) et leur selfie/photo, puis de générer la boucle uniquement avec les participants confirmés tout en conservant leurs jetons `/p/<token>`.
3. **Héritage lors d'un meurtre (`executeKill` dans `server.js`)** : Quand `A` élimine `B`, `A` hérite simultanément de `B.targetId` et de `B.scenario`.
4. **Persistance atomique (`saveState`)** : Toujours écrire dans `killer-state.json.tmp` puis renommer vers `killer-state.json` pour éviter toute corruption.
