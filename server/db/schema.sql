CREATE TABLE IF NOT EXISTS utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    geolocalisation VARCHAR(100),
    mot_de_passe VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS ferme (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS parcelle (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    localisation VARCHAR(100),
    surface DECIMAL(6,2),
    ferme_id INTEGER REFERENCES ferme(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cultures (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    date_semis DATE,
    parcelle_id INTEGER REFERENCES parcelle(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS observation (
    id SERIAL PRIMARY KEY,
    etat VARCHAR(100),
    commentaire TEXT,
    date_ DATE,
    parcelle_id INTEGER REFERENCES parcelle(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alertes (
    id SERIAL PRIMARY KEY,
    date_ DATE,
    type VARCHAR(100),
    niveau VARCHAR(20),
    parcelle_id INTEGER REFERENCES parcelle(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meteo (
    id SERIAL PRIMARY KEY,
    temperature DECIMAL(5,2),
    humidite DECIMAL(5,2),
    pluie_mm DECIMAL(6,2),
    date_heure TIMESTAMP,
    user_id INTEGER REFERENCES utilisateur(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS equipement (
    id SERIAL PRIMARY KEY,
    type_equipement VARCHAR(100),
    nombre INTEGER,
    etat VARCHAR(50),
    ferme_id INTEGER REFERENCES ferme(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS silo (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    pourcent_remplis DECIMAL(5,2),
    ferme_id INTEGER REFERENCES ferme(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stock_cultures (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100),
    nombre INTEGER,
    statut VARCHAR(50),
    date_possede DATE,
    ferme_id INTEGER REFERENCES ferme(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS animaux (
    id SERIAL PRIMARY KEY,
    animal VARCHAR(100),
    nombre INTEGER,
    ferme_id INTEGER REFERENCES ferme(id) ON DELETE CASCADE
);
