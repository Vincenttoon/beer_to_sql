const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  seeAllBeers() {
    return this.connection
      .promise()
      .query(
        "SELECT beers.id, beers.name, breweries.name, styles.name, beers.abv, ratings.value, beers.date_drunk, locations.name, beers.notes FROM beers JOIN ratings ON beers.rating_id = ratings.rating_id JOIN breweries ON beers.brewery_id = breweries.brewery_id JOIN breweries ON beers.brewery_id = breweries.brewery_id JOIN styles ON beers.style_id = styles.style_id JOIN locations ON beers.location_id = locations.location_id;"
      );
  }

  seeAllBreweries() {
    return this.connection.promise().query("SELECT * FROM breweries");
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
}
