*Lire ce document dans d'autres langues : [English](README.md)*

#  2AQVDTM - MVP de Suivi des Cultures (AgTech)

#  Version Française (README.md)

#  2AQVDTM - MVP de Suivi des Cultures (AgTech)

Ce projet est un Minimum Viable Product (MVP) développé dans le cadre du projet d'études de Bachelor 2 à Sup de Vinci. Il s'agit d'une solution numérique full-stack conçue pour aider les acteurs agricoles à surveiller leurs cultures, suivre les conditions météorologiques et améliorer leur prise de décision grâce à un système d'alertes automatisé.

##  Fonctionnalités Principales
- **Tableau de Bord Interactif :** Vue centralisée des données agricoles.
- **Gestion des Parcelles et Cultures :** Suivi des différents terrains et des plantations associées.
- **Intégration Météo :** Suivi de la météo (réelle ou simulée) avec récupération automatique des données.
- **Système d'Alertes Intelligent :** Génération d'avertissements basés sur des règles métier (ex: croisement entre les conditions météo et les observations terrain).

##  Stack Technique
- **Frontend :** React.js (HTML/CSS/JS)
- **Backend :** Node.js / Express.js
- **Base de données :** SQL (Schémas et jeux d'essai pré-configurés)
- **Infrastructure :** Docker & Docker Compose

##  Architecture du Projet

2AQVDTM-dev/
├── public/          # Fichiers statiques
├── server/          # Backend Node.js
│   ├── db/          # Fichiers SQL (MCD, initialisation)
│   ├── routes/      # Endpoints de l'API (météo, alertes, parcelles...)
│   └── services/    # Scripts de récupération externes (ex: meteo-fetch)
├── src/             # Frontend React
│   ├── Components/  # Composants UI (Navbar, Weather, Alerts...)
│   ├── css/         # Feuilles de style (Mode clair/sombre inclus)
│   └── data/        # Jeux de données CSV pour l'initialisation
├── docker-compose.yml
└── Dockerfile


##  Installation & Lancement

Vous pouvez lancer ce projet de manière native ou via Docker.

### Option 1 : Lancement avec Docker (Recommandé)
Assurez-vous d'avoir installé [Docker](https://www.docker.com/) sur votre machine.

# Cloner le dépôt
git clone https://github.com/OVDTM/2AQVDTM.git
cd 2AQVDTM

# Basculer sur la branche de développement
git checkout dev

# Construire et démarrer les conteneurs
docker-compose up --build

L'application sera accessible sur `http://localhost:3000` (Frontend) et l'API sur `http://localhost:5000` (Backend).

### Option 2 : Lancement Local (Node.js requis)

**1. Configuration du Backend**

cd server
npm install
# Configurez votre fichier .env en vous basant sur .env.example
# Initialisez votre base de données SQL avec les fichiers /server/db/schema.sql et seed.sql
npm start


**2. Configuration du Frontend**
Ouvrez un nouveau terminal :

cd ../
npm install
npm start


##  L'Équipe (Groupe 4)

*Projet réalisé lors d'un sprint hackathon de 3 jours et demi.*

- OxoGhost01 (Backend stuff): https://github.com/OxoGhost01

- Coubitic (Database structure and documentation): https://github.com/coubitic

- Ardox (Frontend) : https://github.com/LeVraiArdox 

- Limsayo (Project manager/Architecture) : https://github.com/Limsayo

---