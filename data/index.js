const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  seeAllBeers() {
    return this.connection.promise().query(
      `SELECT b.name AS beer_name, br.name AS brewery_name, s.name AS style_name, b.abv, r.value AS rating_value, DATE_FORMAT(b.date_drunk, '%a %b %d %Y') AS date_drunk, l.name AS location_name, b.notes 
      FROM beers b 
      JOIN ratings r ON b.rating_id = r.rating_id 
      JOIN breweries br ON b.brewery_id = br.brewery_id 
      JOIN styles s ON b.style_id = s.style_id 
      LEFT JOIN locations l ON b.location_id = l.location_id
      ORDER BY br.name, b.name, s.name, b.abv, r.value, b.date_drunk, l.name, b.notes;      
      `
    );
  }

  seeAllBreweries() {
    return this.connection.promise().query("SELECT * FROM breweries");
  }

  getBreweryNames() {
    return this.connection
      .promise()
      .query("SELECT name FROM breweries")
      .then(([rows]) => rows.map((row) => row.name));
  }

  seeAllLocations() {
    return this.connection.promise().query("SELECT * FROM locations");
  }

  seeAllStyles() {
    return this.connection.promise().query("SELECT * FROM styles");
  }

  seeAllRatings() {
    return this.connection.promise().query("SELECT * FROM ratings");
  }

  seeAllBeersByBrewery() {
    return this.connection
      .promise()
      .query(
        "SELECT b.name AS beer_name, br.name AS brewery_name, r.value AS rating FROM beers b JOIN breweries br ON b.brewery_id = br.brewery_id JOIN ratings r ON b.rating_id = r.rating_id ORDER BY br.name;"
      );
  }

  seeAllBeersByStyle() {
    return this.connection
      .promise()
      .query(
        "SELECT styles.name AS style, beers.name,breweries.name AS brewery, beers.abv, ratings.value as ratings FROM beers JOIN styles ON beers.style_id = styles.style_id JOIN breweries ON beers.brewery_id = breweries.brewery_id JOIN ratings ON beers.rating_id = ratings.rating_id ORDER BY style ASC, beers.name ASC, breweries.name ASC, beers.abv ASC, ratings.value ASC;"
      );
  }

  seeBeerByRating() {
    return this.connection
      .promise()
      .query(
        "SELECT ratings.value AS rating_value, beers.name AS beer_name, breweries.name AS brewery_name, styles.name AS style_name, beers.abv, locations.name AS location_name, beers.notes FROM beers JOIN breweries ON beers.brewery_id = breweries.brewery_id JOIN styles ON beers.style_id = styles.style_id JOIN ratings ON beers.rating_id = ratings.rating_id LEFT JOIN locations ON beers.location_id = locations.location_id ORDER BY rating_value DESC, beer_name, brewery_name, style_name, abv, location_name, notes"
      );
  }

  viewBeersByBrewery(breweryName) {
    return this.connection
      .promise()
      .query(
        "SELECT beers.id, beers.name, breweries.name AS brewery_name, styles.name AS style_name, beers.abv, ratings.value AS rating, beers.date_drunk, locations.name AS location_name, beers.notes FROM beers JOIN breweries ON beers.brewery_id = breweries.brewery_id JOIN styles ON beers.style_id = styles.style_id JOIN ratings ON beers.rating_id = ratings.rating_id LEFT JOIN locations ON beers.location_id = locations.location_id WHERE breweries.name = ? ORDER BY beers.name ASC;",
        [breweryName]
      );
  }

  seeBeersSingleByStyle(style) {
    return this.connection
      .promise()
      .query(
        "SELECT * FROM beers JOIN styles ON beers.style_id = styles.style_id WHERE styles.name = ?",
        [style]
      );
  }

  seeBeersBySingleLocation(locationName) {
    return this.connection.promise().query(
      `SELECT beers.name, breweries.name, locations.name 
      FROM beers 
      JOIN breweries ON beers.brewery_id = breweries.brewery_id 
      JOIN locations ON beers.location_id = locations.location_id 
      WHERE locations.name = ?`,
      [locationName]
    );
  }

  seeBeersBySingleRating(rating) {
    return this.connection.promise().query(
      `SELECT beers.id, beers.name, b1.name, styles.name, beers.abv, ratings.value, beers.date_drunk, locations.name, beers.notes 
        FROM beers 
        JOIN ratings ON beers.rating_id = ratings.rating_id 
        JOIN breweries b1 ON beers.brewery_id = b1.brewery_id 
        JOIN styles ON beers.style_id = styles.style_id 
        LEFT JOIN locations ON beers.location_id = locations.location_id 
        WHERE ratings.value = ?;`,
      [rating]
    );
  }

  addBrewery(name, city, state) {
    return this.connection
      .promise()
      .query("INSERT INTO breweries (name, city, state) VALUES (?, ?, ?)", [
        name,
        city,
        state,
      ]);
  }

  addLocation(name, city, state) {
    return this.connection
      .promise()
      .query("INSERT INTO locations (name, city, state) VALUES (?, ?, ?)", [
        name,
        city,
        state,
      ]);
  }

  addStyle(name) {
    return this.connection
      .promise()
      .query("INSERT INTO styles (name) VALUES (?)", [name]);
  }

  addBeer = (
    name,
    brewery_name,
    style_name,
    abv,
    rating_id,
    date_drunk,
    location_name,
    notes
  ) => {
    return this.connection
      .promise()
      .query(
        "INSERT INTO beers (name, brewery_name, style_name, abv, rating_id, date_drunk, location_name, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          brewery_name,
          style_name,
          abv,
          rating_id,
          date_drunk,
          location_name,
          notes,
        ]
      );
  };

  updateBeerRating(beerId, newRating) {
    return this.connection
      .promise()
      .query("UPDATE beers SET rating_id = ? WHERE id = ?", [
        newRating,
        beerId,
      ]);
  }

  deleteBeer(id) {
    return this.connection
      .promise()
      .query("DELETE FROM beers WHERE id = ?", [id]);
  }
}

module.exports = new DB(connection);
