#!/usr/bin/env bash
set -euo pipefail

VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:-oxoghost.dev}"
REMOTE_DIR="${REMOTE_DIR:-/opt/2aqvdtm}"

echo "→ Syncing files to $VPS_USER@$VPS_HOST:$REMOTE_DIR"

rsync -avz --delete \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='server/node_modules/' \
  --exclude='build/' \
  --exclude='.env' \
  --exclude='.env.*' \
  --exclude='coverage/' \
  ./ "$VPS_USER@$VPS_HOST:$REMOTE_DIR/"

echo "→ Deploying on VPS"

ssh "$VPS_USER@$VPS_HOST" bash <<EOF
  set -euo pipefail
  cd "$REMOTE_DIR"

  if [ ! -f .env ]; then
    echo "ERREUR : fichier .env manquant sur le VPS dans $REMOTE_DIR"
    echo "Crée-le manuellement avant de relancer le déploiement."
    exit 1
  fi

  docker compose -f docker-compose.prod.yml pull --ignore-buildable 2>/dev/null || true
  docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

  echo "→ Nettoyage des images inutilisées"
  docker image prune -f

  echo "→ Statut des conteneurs"
  docker compose -f docker-compose.prod.yml ps
EOF

echo ""
echo "Déploiement terminé. Site disponible sur http://2aqvdtm.oxoghost.dev"
