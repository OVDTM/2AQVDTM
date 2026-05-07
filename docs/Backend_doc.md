# Documentation Backend

## Stack Technique

- **[Node.js](https://nodejs.org/) / [Express.js](https://expressjs.com/)** : Serveur HTTP et routage.
- **[pg](https://node-postgres.com/)** : Client PostgreSQL (connexion via pool).
- **[node-cron](https://github.com/node-cron/node-cron)** : Planificateur de tâches récurrentes.
- **[nodemailer](https://nodemailer.com/)** : Envoi d'emails SMTP.
- **[dotenv](https://github.com/motdotla/dotenv)** : Chargement des variables d'environnement depuis `.env`.

---

## Structure des fichiers

```
server/
├── server.js          # Point d'entrée : Express, middlewares, montage des routes
├── scheduler.js       # Tâches planifiées (météo horaire, emails à 8h)
├── db/
│   ├── index.js       # Pool de connexion PostgreSQL (pg.Pool)
│   ├── schema.sql     # Définition des tables
│   └── seed.sql       # Données initiales
├── routes/
│   ├── fermes.js      # CRUD /api/fermes
│   ├── parcelles.js   # CRUD /api/parcelles
│   ├── cultures.js    # CRUD /api/cultures
│   ├── observations.js# CRUD /api/observations
│   ├── alertes.js     # CRUD + génération /api/alertes
│   ├── meteo.js       # Lecture + refresh /api/meteo
│   └── dashboard.js   # Agrégat /api/dashboard
└── services/
    ├── meteo-fetch.js  # Appels Open-Meteo + sauvegarde en BDD
    └── email.js        # Envoi des prévisions météo par email (nodemailer)
```

---

## API Endpoints

Le serveur écoute sur le port `5010` (configurable via `PORT` dans `.env`).  
Toutes les routes sont préfixées par `/api`.

### Santé

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Retourne `{ status: "ok" }` |

---

### Fermes — `/api/fermes`

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/fermes` | Liste toutes les fermes |
| `GET` | `/api/fermes/:id` | Détail d'une ferme |
| `POST` | `/api/fermes` | Créer une ferme |
| `PUT` | `/api/fermes/:id` | Modifier une ferme |
| `DELETE` | `/api/fermes/:id` | Supprimer une ferme |

**Corps POST/PUT :**
```json
{ "nom": "Ferme du Soleil", "user_id": 1 }
```

---

### Parcelles — `/api/parcelles`

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/parcelles` | Liste toutes les parcelles |
| `GET` | `/api/parcelles/:id` | Détail d'une parcelle |
| `POST` | `/api/parcelles` | Créer une parcelle |
| `PUT` | `/api/parcelles/:id` | Modifier une parcelle |
| `DELETE` | `/api/parcelles/:id` | Supprimer une parcelle |

**Corps POST/PUT :**
```json
{ "nom": "Parcelle A", "localisation": "Zone Nord", "surface": 4.5, "ferme_id": 1 }
```

---

### Cultures — `/api/cultures`

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/cultures` | Liste toutes les cultures |
| `GET` | `/api/cultures?parcelle_id=X` | Filtre par parcelle |
| `GET` | `/api/cultures/:id` | Détail d'une culture |
| `POST` | `/api/cultures` | Créer une culture |
| `PUT` | `/api/cultures/:id` | Modifier une culture |
| `DELETE` | `/api/cultures/:id` | Supprimer une culture |

**Corps POST/PUT :**
```json
{ "type": "Blé", "date_semis": "2026-03-15", "parcelle_id": 2 }
```

---

### Observations — `/api/observations`

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/observations` | Liste toutes les observations |
| `GET` | `/api/observations?parcelle_id=X` | Filtre par parcelle |
| `GET` | `/api/observations/:id` | Détail d'une observation |
| `POST` | `/api/observations` | Créer une observation |
| `PUT` | `/api/observations/:id` | Modifier une observation |
| `DELETE` | `/api/observations/:id` | Supprimer une observation |

**Corps POST :**
```json
{ "etat": "bon", "commentaire": "Croissance normale", "date_": "2026-05-01", "parcelle_id": 1 }
```

---

### Alertes — `/api/alertes`

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/alertes` | Alertes stockées en BDD **+** alertes générées dynamiquement |
| `GET` | `/api/alertes/parcelle/:parcelle_id` | Alertes d'une parcelle |
| `POST` | `/api/alertes` | Créer une alerte manuellement |
| `DELETE` | `/api/alertes/:id` | Supprimer une alerte |

Le `GET /api/alertes` retourne deux listes :
```json
{
  "stockees": [ /* alertes en base */ ],
  "generees": [ /* alertes calculées en temps réel depuis la dernière météo */ ]
}
```

**Règles métier de génération automatique :**

| Condition | Type | Niveau |
|---|---|---|
| Humidité > 80 % ET température > 20 °C | `risque_maladie` | élevé |
| Pluie = 0 mm ET température > 30 °C | `risque_secheresse` | moyen |
| Température < 0 °C | `risque_gel` | élevé |

---

### Météo — `/api/meteo`

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/meteo` | Historique complet (ordre décroissant) |
| `GET` | `/api/meteo/derniere` | Dernière entrée en BDD |
| `GET` | `/api/meteo/refresh` | Appel Open-Meteo + sauvegarde + retour des données actuelles et prévisions J+7 |
| `POST` | `/api/meteo` | Insérer une entrée météo manuellement |

**Réponse de `/api/meteo/refresh` :**
```json
{
  "temperature": 18.5,
  "humidite": 72,
  "pluie_mm": 0,
  "vent_kmh": 14,
  "pression_hpa": 1012,
  "ressenti": 17.2,
  "condition_code": 2,
  "date_heure": "2026-05-07T10:00",
  "previsions": [
    { "date": "2026-05-07", "min": 12, "max": 21, "lever_soleil": "06:12", "coucher_soleil": "21:03", "condition_code": 1 }
  ]
}
```

---

### Dashboard — `/api/dashboard`

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Agrégat : nb parcelles, alertes de la semaine, 5 dernières observations, météo actuelle |

**Réponse :**
```json
{
  "nb_parcelles": 5,
  "alertes_semaine": 3,
  "dernieres_observations": [ /* 5 dernières */ ],
  "meteo_actuelle": { /* dernière entrée météo */ }
}
```

---

### Debug

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/debug/emails` | Déclenche manuellement l'envoi des emails météo |

---

## Scheduler (Tâches planifiées)

Démarré automatiquement au lancement du serveur via `demarrerScheduler()`.

| Planification | Tâche |
|---|---|
| Toutes les heures (`:00`) | Appel Open-Meteo pour tous les utilisateurs avec géolocalisation, sauvegarde en BDD |
| Chaque jour à **8h00** | Envoi d'un email de prévisions météo J+7 à chaque utilisateur |

Au démarrage, un premier appel météo est effectué immédiatement sans attendre la prochaine heure.

---

## Services

### `services/meteo-fetch.js`

Consomme l'API [Open-Meteo](https://open-meteo.com/) (gratuite, sans clé API).

- `fetchDonneesMeteo(lat, lon)` — Retourne les données actuelles + prévisions 7 jours.
- `sauvegarderMeteo(data, user_id)` — Insère température, humidité, pluie en BDD.
- `fetchMeteoTousUtilisateurs()` — Boucle sur tous les utilisateurs avec géolocalisation et sauvegarde.

### `services/email.js`

Envoie un email HTML formaté avec le résumé du jour et un tableau des 7 prochains jours.

- `envoyerPrevisionsJour(email, previsions)` — Génère et envoie l'email via SMTP.

Les codes météo Open-Meteo (`weather_code`) sont traduits en labels lisibles (ex: `0` → `Ciel dégagé`, `95` → `Orage`).

---

## Variables d'environnement

| Variable | Défaut | Description |
|---|---|---|
| `PORT` | `5000` | Port d'écoute du serveur |
| `DATABASE_URL` | — | URL complète PostgreSQL (`postgresql://user:pass@host:5432/db`) |
| `SMTP_HOST` | — | Serveur SMTP |
| `SMTP_PORT` | `587` | Port SMTP |
| `SMTP_SECURE` | `false` | TLS direct (`true` pour port 465) |
| `SMTP_USER` | — | Identifiant SMTP |
| `SMTP_PASS` | — | Mot de passe SMTP |
| `SMTP_FROM` | valeur de `SMTP_USER` | Adresse expéditeur affichée |
