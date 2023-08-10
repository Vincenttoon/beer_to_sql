DROP TABLE IF EXISTS vinny_beers_db;

CREATE DATABASE vinny_beers_db;
USE vinny_beers_db;

DROP TABLE IF EXISTS beers;

CREATE TABLE breweries (
  brewery_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  brewery_name VARCHAR(255) NOT NULL,
  brewery_city VARCHAR(255),
  brewery_state VARCHAR(50)
);

CREATE TABLE ratings (
  rating_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  value DECIMAL(3,2) NOT NULL
);

CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    location_city VARCHAR(255),
    location_state VARCHAR(50)
);

CREATE TABLE styles (
    style_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    style_name VARCHAR(255)
);

CREATE TABLE beers (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  brewery_name VARCHAR(255) NOT NULL,
  style_name VARCHAR(255) NOT NULL,
  abv DECIMAL(3,2) NOT NULL,
  rating_id INT NOT NULL,
  date_drunk DATE NOT NULL,
  location_name VARCHAR(255),
  notes TEXT,
  FOREIGN KEY (brewery_name) REFERENCES breweries(brewery_name),
  FOREIGN KEY (style_name) REFERENCES styles(style_name),
  FOREIGN KEY (rating_id) REFERENCES ratings(rating_id),
  FOREIGN KEY (location_name) REFERENCES locations(location_name)
);
