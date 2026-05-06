*Read this in other languages: [Français](README.fr.md)*

#  2AQVDTM - AgTech Crop Monitoring MVP

#  English Version (README.md)

#  2AQVDTM - AgTech Crop Monitoring MVP

This project is a Minimum Viable Product (MVP) developed as part of the Sup de Vinci Bachelor 2 curriculum. It provides a full-stack digital solution to help agricultural professionals monitor their crops, track local weather conditions, and improve decision-making through an automated alert system.

##  Key Features
- **Interactive Dashboard:** Centralized view of agricultural data.
- **Plot & Crop Management:** Track different parcels and the cultures planted on them.
- **Weather Integration:** Real-time (or simulated) weather tracking and automated data fetching.
- **Smart Alert System:** Generates warnings based on business rules (e.g., specific weather conditions crossing observation thresholds).

##  Tech Stack
- **Frontend:** React.js (HTML/CSS/JS)
- **Backend:** Node.js / Express.js
- **Database:** SQL (Pre-configured schema and seeds)
- **Infrastructure:** Docker & Docker Compose

##  Project Structure

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


##  Getting Started

You can run this project either natively or using Docker.

### Option 1: Run with Docker (Recommended)
Ensure you have [Docker](https://www.docker.com/) installed on your machine.

git clone https://github.com/OVDTM/2AQVDTM.git
cd 2AQVDTM

# Switch to the development branch
git checkout dev

# Build and start the containers
docker-compose up --build

The application will be available at `http://localhost:3000` (Frontend) and the API at `http://localhost:5000` (Backend).

### Option 2: Run Locally (Node.js required)

**1. Setup the Backend**

cd server
npm install
# Set up your .env file based on .env.example
# Initialize your SQL database using /server/db/schema.sql and seed.sql
npm start


**2. Setup the Frontend**
Open a new terminal window:

cd ../
npm install
npm start


##  The Team (Group 4)
*Developed during a 3.5-day hackathon sprint by :*

- OxoGhost01 (Backend stuff): https://github.com/OxoGhost01

- Coubitic (Database structure and documentation): https://github.com/coubitic

- Ardox (Frontend) : https://github.com/LeVraiArdox 

- Limsayo (Project manager/Architecture) : https://github.com/Limsayo

---


