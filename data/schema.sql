DROP DATABASE IF EXISTS vinny_beers_db;
CREATE DATABASE vinny_beers_db;
USE vinny_beers_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS beers;
DROP TABLE IF EXISTS breweries;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS styles;

-- Styles
CREATE TABLE styles (
  style_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  style_name VARCHAR(255)
);

-- Breweries
CREATE TABLE breweries (
  brewery_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  brewery_name VARCHAR(255) NOT NULL,
  brewery_city VARCHAR(255),
  brewery_state VARCHAR(50)
);

-- Locations
CREATE TABLE locations (
  location_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  location_city VARCHAR(255),
  location_state VARCHAR(50)
);

-- Table Alterations
ALTER TABLE styles ADD INDEX (style_name);
ALTER TABLE breweries ADD INDEX (brewery_name);
ALTER TABLE locations ADD INDEX (location_name);

-- Ratings
CREATE TABLE ratings (
  rating_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  value DECIMAL(3,2) NOT NULL
);

-- Beers, the grand daddy
CREATE TABLE beers (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  brewery_name VARCHAR(255) NOT NULL, -- Add brewery_name column
  style_name VARCHAR(255) NOT NULL,
  abv DECIMAL(3,2) NOT NULL,
  rating_id INT NOT NULL,
  date_drunk DATE NOT NULL,
  location_name VARCHAR(255),
  notes TEXT,
  FOREIGN KEY (style_name) REFERENCES styles(style_name),
  FOREIGN KEY (rating_id) REFERENCES ratings(rating_id),
  FOREIGN KEY (location_name) REFERENCES locations(location_name),
  FOREIGN KEY (brewery_name) REFERENCES breweries(brewery_name)
);