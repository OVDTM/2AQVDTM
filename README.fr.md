*Lire ce document dans d'autres langues : [English](README.md)*

# 2AQVDTM - MVP de Suivi des Cultures (AgTech)

Ce projet est un Minimum Viable Product (MVP) développé dans le cadre du Bachelor 2 à Sup de Vinci. Il s'agit d'une solution numérique full-stack conçue pour aider les acteurs agricoles à surveiller leurs cultures, suivre les conditions météorologiques et améliorer leur prise de décision grâce à un système d'alertes automatisé.

**En ligne :** https://2aqvdtm.oxoghost.dev

## Fonctionnalités Principales
- **Tableau de Bord Interactif :** Vue centralisée des données agricoles.
- **Gestion des Parcelles et Cultures :** Suivi des différents terrains et des plantations associées.
- **Intégration Météo :** Suivi météo en temps réel avec récupération automatique des données.
- **Système d'Alertes Intelligent :** Génération d'avertissements basés sur des règles métier (ex : croisement entre conditions météo et observations terrain).

## Stack Technique
- **Frontend :** React.js
- **Backend :** Node.js / Express.js
- **Base de données :** PostgreSQL 16
- **Infrastructure :** Docker & Docker Compose

## Architecture du Projet

```
2AQVDTM/
├── public/                  # Fichiers statiques
├── src/                     # Frontend React
│   ├── Components/          # Composants UI (Navbar, Weather, Alerts...)
│   ├── css/                 # Feuilles de style (mode clair/sombre inclus)
│   └── data/                # Jeux de données CSV pour l'initialisation
├── server/                  # Backend Node.js
│   ├── db/                  # Fichiers SQL (schéma et seeds)
│   ├── routes/              # Endpoints de l'API (météo, alertes, parcelles...)
│   └── services/            # Scripts de récupération externes (ex: meteo-fetch)
├── Dockerfile               # Image de développement (backend uniquement)
├── Dockerfile.prod          # Image de production (build React + backend)
├── docker-compose.yml       # Stack de développement
├── docker-compose.prod.yml  # Stack de production (avec PostgreSQL)
├── deploy.sh                # Script de déploiement (rsync + build distant)
└── .env.example             # Modèle de variables d'environnement
```

## Installation & Lancement (Développement)

### Option 1 : Docker (Recommandé)

```bash
git clone https://github.com/OVDTM/2AQVDTM.git
cd 2AQVDTM
cp .env.example .env        # Remplir les valeurs
docker compose up --build
```

L'API sera accessible sur `http://localhost:5010`.  
Le serveur de développement React sera accessible sur `http://localhost:3000` (les appels API sont automatiquement proxifiés vers le port 5010).

### Option 2 : Lancement Local (Node.js requis)

**1. Backend**

```bash
cd server
npm install
# Configurer le fichier .env à partir de .env.example
node server.js
```

**2. Frontend** (nouveau terminal)

```bash
npm install
npm start
```

## Déploiement en Production

La stack de production build l'application React dans Docker et la sert via Express.  
Nginx sur le VPS fait office de reverse proxy vers le port 5010.

### Prérequis (sur le VPS, une seule fois)

```bash
mkdir -p /opt/2aqvdtm
nano /opt/2aqvdtm/.env   # Remplir les valeurs de production (voir .env.example)
```

### Déployer

```bash
VPS_USER=<utilisateur> VPS_HOST=<ip-du-vps> ./deploy.sh
```

Le script synchronise le projet via rsync (sans `.env`, `node_modules`, `build/`) puis lance `docker compose -f docker-compose.prod.yml up -d --build` sur le VPS.

### Variables d'Environnement

Voir `.env.example` pour la liste complète. Obligatoires en production :

| Variable | Description |
|---|---|
| `POSTGRES_DB` | Nom de la base de données |
| `POSTGRES_USER` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL |
| `DATABASE_URL` | URL de connexion PostgreSQL complète |
| `SMTP_HOST` | Serveur SMTP |
| `SMTP_USER` | Identifiant SMTP |
| `SMTP_PASS` | Mot de passe SMTP |
| `SMTP_FROM` | Adresse email expéditeur |

## L'Équipe (Groupe 4)
*Projet réalisé lors d'un sprint hackathon de 3 jours et demi.*

- OxoGhost01 (Backend) : https://github.com/OxoGhost01
- Coubitic (Base de données & documentation) : https://github.com/coubitic
- Ardox (Frontend) : https://github.com/LeVraiArdox
- Limsayo (Chef de projet / Architecture) : https://github.com/Limsayo
