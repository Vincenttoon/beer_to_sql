DROP TABLE IF EXISTS vinny_beers_db;

CREATE DATABASE vinny_beers_db;
USE vinny_beers_db;

DROP TABLE IF EXISTS beers;
DROP TABLE IF EXISTS breweries;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS ratings;

CREATE TABLE breweries (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
);

CREATE TABLE ratings (
  id INT PRIMARY KEY,
  value INT NOT NULL
);

CREATE TABLE locations (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
    city VARCHAR(255),
    state VARCHAR(50)
);

CREATE TABLE styles (
    id INT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE beers (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brewery_id INT NOT NULL,
  style_id INT NOT NULL,
  abv DECIMAL(3,2) NOT NULL,
  rating_id INT NOT NULL,
  date_drunk DATE NOT NULL,
  location_id INT,
  notes TEXT,
  FOREIGN KEY (brewery_id) REFERENCES breweries(id),
  FOREIGN KEY (style_id) REFERENCES styles(id),
  FOREIGN KEY (rating_id) REFERENCES ratings(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);