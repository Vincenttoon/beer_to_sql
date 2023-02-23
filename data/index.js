const connection = require('./connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    seeAllBeers() {
        return this.connection
            .promise()
            .query('SELECT beers.id, beers.name, breweries.name, styles.name, beers.abv, ratings.value, beers.date_drunk, locations.name, beers.notes FROM beers JOIN ratings ON beers.rating_id = ratings.rating_id JOIN breweries ON beers.brewery_id = breweries.brewery_id JOIN breweries ON beers.brewery_id = breweries.brewery_id JOIN styles ON beers.style_id = styles.style_id JOIN locations ON beers.location_id = locations.location_id;');
    }
}

