#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
echo "🔨 Construction de l'image Docker killer-game..."
docker compose build

echo "🧪 Exécution des tests automatisés (unitaires + API bout-en-bout)..."
docker run --rm killer-game:latest npm test

echo "🚀 Déploiement du conteneur killer-game..."
docker compose up -d

echo "✅ Vérification de santé (/api/health)..."
sleep 2
curl -fsS http://127.0.0.1:3099/api/health
echo ""
echo "🎯 Déploiement terminé avec succès !"
