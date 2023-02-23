DROP TABLE IF EXISTS vinny_beers_db;

CREATE DATABASE vinny_beers_db;
USE vinny_beers_db;

DROP TABLE IF EXISTS beers;
DROP TABLE IF EXISTS breweries;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS ratings;

CREATE TABLE breweries (
  brewery_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE ratings (
  rating_id INT PRIMARY KEY,
  value INT NOT NULL
);

CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    state VARCHAR(50)
);

CREATE TABLE styles (
    style_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(255)
);

CREATE TABLE beers (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  brewery_id INT NOT NULL,
  style_id INT NOT NULL,
  abv DECIMAL(3,2) NOT NULL,
  rating_id INT NOT NULL,
  date_drunk DATE NOT NULL,
  location_id INT,
  notes TEXT,
  FOREIGN KEY (brewery_id) REFERENCES breweries(brewery_id),
  FOREIGN KEY (style_id) REFERENCES styles(style_id),
  FOREIGN KEY (rating_id) REFERENCES ratings(rating_id),
  FOREIGN KEY (location_id) REFERENCES locations(location_id)
);