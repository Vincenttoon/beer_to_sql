const connection = require("./connection");
const inquirer = require("inquirer");
const db = require("../data");

// Function to prompt user for new brewery details
async function promptForBreweryDetails(connection) {
  try {
    // Prompt the user if they want to add a new brewery
    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "addBrewery",
        message: "Brewery not found. Do you want to add a new brewery?",
      },
    ]);

    if (answer.addBrewery) {
      // Prompt user for new brewery details
      const newBrewery = await inquirer.prompt([
        {
          type: "input",
          name: "new_brewery_name",
          message: "Enter the name of the new brewery:",
        },
        {
          type: "input",
          name: "new_brewery_city",
          message: "Enter the city of the new brewery:",
        },
        {
          type: "input",
          name: "new_brewery_state",
          message: "Enter the state of the new brewery:",
        },
      ]);

      // Process and insert new brewery details into the database
      // Replace the following with your actual database insertion code
      const { new_brewery_name, new_brewery_city, new_brewery_state } =
        newBrewery;
      const insertQuery =
        "INSERT INTO breweries (brewery_name, brewery_city, brewery_state) VALUES (?, ?, ?)";
      const insertValues = [
        new_brewery_name,
        new_brewery_city,
        new_brewery_state,
      ];
      await connection.promise().query(insertQuery, insertValues);

      console.log("New brewery added to the database.");
      console.log("Brewery Name:", new_brewery_name);
      console.log("Brewery City:", new_brewery_city);
      console.log("Brewery State:", new_brewery_state);
    } else {
      console.log("Brewery not added.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  seeAllBeers() {
    return this.connection.promise().query(
      `SELECT b.name AS beer_name, br.brewery_name, s.style_name, b.abv, r.value AS rating_value, DATE_FORMAT(b.date_drunk, '%a %b %d %Y') AS date_drunk, l.location_name, b.notes 
      FROM beers b 
      JOIN ratings r ON b.rating_id = r.rating_id 
      JOIN breweries br ON b.brewery_name = br.brewery_name -- Use the correct alias and column name
      JOIN styles s ON b.style_name = s.style_name -- Similarly, use the correct alias and column name
      LEFT JOIN locations l ON b.location_name = l.location_name
      ORDER BY br.brewery_name, b.name, s.style_name, b.abv, r.value, b.date_drunk, l.location_name, b.notes;      
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
      .query(
        "INSERT INTO breweries (brewery_name, brewery_city, brewery_state) VALUES (?, ?, ?)",
        [name, city, state]
      )
      .then(([result]) => {
        if (result.affectedRows > 0) {
          console.log("New brewery added to the database.");
          console.log("Brewery Name:", name);
          console.log("Brewery City:", city);
          console.log("Brewery State:", state);
        } else {
          console.log("Brewery not added.");
        }
      })
      .catch((error) => {
        console.error("Error adding brewery:", error);
      });
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

  // Function to add a new beer to the database
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

  // ... Other methods ...

  getBreweryByName = (breweryName) => {
    return this.connection
      .promise()
      .query("SELECT * FROM breweries WHERE brewery_name = ?", [breweryName])
      .then(([rows]) => {
        if (rows.length > 0) {
          return rows[0]; // Return the first brewery matching the name
        } else {
          return promptForBreweryDetails(this.connection); // Call the promptForBreweryDetails function
        }
      })
      .catch((error) => {
        throw error;
      });
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
