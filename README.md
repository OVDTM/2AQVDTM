*Read this in other languages: [Français](README.fr.md)*

# 2AQVDTM - AgTech Crop Monitoring MVP

#  2AQVDTM - AgTech Crop Monitoring MVP

This project is a Minimum Viable Product (MVP) developed as part of the Sup de Vinci Bachelor 2 curriculum. It provides a full-stack digital solution to help agricultural professionals monitor their crops, track local weather conditions, and improve decision-making through an automated alert system.

**Live:** https://2aqvdtm.oxoghost.dev

## Key Features
- **Interactive Dashboard:** Centralized view of agricultural data.
- **Plot & Crop Management:** Track different parcels and the cultures planted on them.
- **Weather Integration:** Real-time weather tracking and automated data fetching.
- **Smart Alert System:** Generates warnings based on business rules (e.g., specific weather conditions crossing observation thresholds).

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js / Express.js
- **Database:** PostgreSQL 16
- **Infrastructure:** Docker & Docker Compose

## Project Structure

<<<<<<< Updated upstream
2AQVDTM-dev/
├── public/          # Static assets
├── server/          # Node.js Backend
│   ├── db/          # SQL schema and seed files
│   ├── routes/      # API endpoints (weather, alerts, plots...)
│   └── services/    # External API fetchers (e.g., meteo-fetch)
├── src/             # React Frontend
│   ├── Components/  # Reusable UI components (Navbar, Weather, Alerts...)
│   ├── css/         # Stylesheets (Light/Dark mode supported)
│   └── data/        # CSV datasets for initial data loading
├── docker-compose.yml
└── Dockerfile

=======
```
2AQVDTM/
├── public/                  # Static assets
├── src/                     # React frontend
│   ├── Components/          # Reusable UI components (Navbar, Weather, Alerts...)
│   ├── css/                 # Stylesheets (light/dark mode supported)
│   └── data/                # CSV datasets for initial data loading
├── server/                  # Node.js backend
│   ├── db/                  # SQL schema and seed files
│   ├── routes/              # API endpoints (weather, alerts, plots...)
│   └── services/            # External API fetchers (e.g., meteo-fetch)
├── Dockerfile               # Development image (backend only)
├── Dockerfile.prod          # Production image (React build + backend)
├── docker-compose.yml       # Development stack
├── docker-compose.prod.yml  # Production stack (with PostgreSQL)
├── deploy.sh                # Deployment script (rsync + remote build)
└── .env.example             # Environment variable template
```
>>>>>>> Stashed changes

## Getting Started (Development)

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/OVDTM/2AQVDTM.git
cd 2AQVDTM
cp .env.example .env        # Fill in your values
docker compose up --build
```

The API will be available at `http://localhost:5010`.  
The React dev server will be available at `http://localhost:3000` (proxies API calls to port 5010).

### Option 2: Run Locally (Node.js required)

**1. Backend**

```bash
cd server
npm install
# Configure your .env file based on .env.example
node server.js
```

**2. Frontend** (new terminal)

```bash
npm install
npm start
```

## Production Deployment

The production stack builds the React app inside Docker and serves it through Express.  
Nginx on the VPS acts as a reverse proxy to port 5010.

### Prerequisites (on the VPS, once)

```bash
mkdir -p /opt/2aqvdtm
nano /opt/2aqvdtm/.env   # Fill in production values (see .env.example)
```

### Deploy

```bash
VPS_USER=<user> VPS_HOST=<your-vps-ip> ./deploy.sh
```

The script rsyncs the project (excluding `.env`, `node_modules`, `build/`) and runs `docker compose -f docker-compose.prod.yml up -d --build` on the VPS.

### Environment Variables

See `.env.example` for the full list. Required for production:

| Variable | Description |
|---|---|
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `SMTP_HOST` | SMTP server host |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | Sender email address |

## The Team (Group 4)
*Developed during a 3.5-day hackathon sprint.*

- OxoGhost01 (Backend): https://github.com/OxoGhost01
- Coubitic (Database & documentation): https://github.com/coubitic
- Ardox (Frontend): https://github.com/LeVraiArdox
- Limsayo (Project manager / Architecture): https://github.com/Limsayo
