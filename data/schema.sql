DROP TABLE IF EXISTS vinny_beers_db;

CREATE DATABASE vinny_beers_db;
USE vinny_beers_db;

DROP TABLE IF EXISTS beers;

CREATE TABLE beers ( 
    id INT PRIMARY KEY
    name VARCHAR(255) NOT NULL,
    brewery VARCHAR(255) NOT NULL,
    style VARCHAR(255) NOT NULL,
    abv DECIMAL(3,1) NOT NULL,
    rating INT NOT NULL,
    date_drunk DATE NOT NULL,
    location VARCHAR(255),
    notes TEXT
)