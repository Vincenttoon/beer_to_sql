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

  seeAllStyles() {
    return this.connection
      .promise()
      .query("SELECT * FROM styles ORDER BY style_name, style_id");
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

  seeBeerByRating() {
    return this.connection
      .promise()
      .query(
        "SELECT ratings.value AS rating_value, beers.name AS beer_name, breweries.name AS brewery_name, styles.name AS style_name, beers.abv, locations.name AS location_name, beers.notes FROM beers JOIN breweries ON beers.brewery_id = breweries.brewery_id JOIN styles ON beers.style_id = styles.style_id JOIN ratings ON beers.rating_id = ratings.rating_id LEFT JOIN locations ON beers.location_id = locations.location_id ORDER BY rating_value DESC, beer_name, brewery_name, style_name, abv, location_name, notes"
      );
  }

  seeBeersByBrewery(breweryName) {
    return connection
      .promise()
      .query(
        `SELECT beers.id, beers.name, b.brewery_name, styles.style_name, beers.abv, ratings.value AS rating, beers.date_drunk, locations.location_name, beers.notes 
        FROM beers 
        JOIN breweries AS b ON beers.brewery_name = b.brewery_name 
        JOIN styles ON beers.style_name = styles.style_name 
        JOIN ratings ON beers.rating_id = ratings.rating_id 
        LEFT JOIN locations ON beers.location_name = locations.location_name 
        WHERE b.brewery_name = ? 
        ORDER BY beers.name ASC;`,
        [breweryName]
      )
      .then(([rows]) => {
        return rows;
      })
      .catch((error) => {
        throw error;
      });
  }

  seeBeersByStyle = (style) => {
    return this.connection.promise().query(
      `SELECT beers.id, beers.name, b.brewery_name, styles.style_name, beers.abv, ratings.value AS rating, beers.date_drunk, locations.location_name, beers.notes 
       FROM beers 
       JOIN breweries AS b ON beers.brewery_name = b.brewery_name 
       JOIN styles ON beers.style_name = styles.style_name 
       JOIN ratings ON beers.rating_id = ratings.rating_id 
       LEFT JOIN locations ON beers.location_name = locations.location_name 
       WHERE styles.style_name = ? 
       ORDER BY b.brewery_name ASC, beers.name ASC;`, // Order by brewery_name first, then by beer name
      [style]
    );
  };

  seeBeersBySingleRating(rating) {
    return this.connection.promise().query(
      `SELECT beers.id, beers.name, breweries.brewery_name, styles.style_name, beers.abv, ratings.value AS rating, beers.date_drunk, locations.location_name, beers.notes 
      FROM beers 
      JOIN ratings ON beers.rating_id = ratings.rating_id 
      JOIN breweries ON beers.brewery_name = breweries.brewery_name 
      JOIN styles ON beers.style_name = styles.style_name 
      LEFT JOIN locations ON beers.location_name = locations.location_name 
      WHERE ratings.value = ?
      ORDER BY breweries.brewery_name ASC, beers.name ASC;`, // Order by brewery_name first, then by beer name
      [rating]
    );
  }

  findBeerByName(name) {
    return this.connection.promise().query(
      `SELECT beers.id, beers.name, breweries.brewery_name, styles.style_name, beers.abv, ratings.value AS rating, beers.date_drunk, locations.location_name, beers.notes 
      FROM beers 
      JOIN ratings ON beers.rating_id = ratings.rating_id 
      JOIN breweries ON beers.brewery_name = breweries.brewery_name 
      JOIN styles ON beers.style_name = styles.style_name 
      LEFT JOIN locations ON beers.location_name = locations.location_name 
      WHERE beers.name = ?;`,
      [name]
    );
  }

  async addBrewery(name, city, state) {
    try {
      const insertQuery = `
        INSERT INTO breweries (brewery_name, brewery_city, brewery_state)
        VALUES (?, ?, ?)
      `;
      const insertValues = [name, city, state];

      const [result] = await this.connection
        .promise()
        .query(insertQuery, insertValues);

      if (result.affectedRows > 0) {
        console.log("New brewery added to the database.");
        console.log("Brewery Name:", name);
        console.log("Brewery City:", city);
        console.log("Brewery State:", state);
      } else {
        console.log("Brewery not added.");
      }
    } catch (error) {
      console.error("Error adding brewery:", error);
    }
  }

  addStyle(name) {
    return this.connection
      .promise()
      .query("INSERT INTO styles (style_name) VALUES (?)", [name]);
  }

  // Function to add a new beer to the database
  async addBeer(
    name,
    brewery_name,
    style_name,
    abv,
    rating_id,
    date_drunk,
    location_name,
    notes
  ) {
    try {
      const brewery = await this.getBreweryByName(brewery_name);

      if (brewery) {
        // Brewery exists, add the beer with the existing brewery_id
        const insertQuery = `
          INSERT INTO beers (name, brewery_name, style_name, abv, rating_id, date_drunk, location_name, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [
          name,
          brewery_name,
          style_name,
          abv,
          rating_id,
          date_drunk,
          location_name,
          notes,
        ];

        const [result] = await this.connection
          .promise()
          .query(insertQuery, insertValues);

        if (result.affectedRows > 0) {
          console.log("Beer added to database.");
        } else {
          console.log("Error adding beer.");
        }
      } else {
        console.log("Error: Brewery not found.");
      }
    } catch (error) {
      console.error("Error adding beer:", error);
    }
  }

  // ... Other methods ...

  async getBreweryByName(breweryName) {
    try {
      const [rows] = await this.connection
        .promise()
        .query("SELECT * FROM breweries WHERE brewery_name = ?", [breweryName]);

      if (rows.length > 0) {
        return rows[0]; // Return the first brewery matching the name
      } else {
        const newBrewery = await promptForBreweryDetails(this.connection);
        return newBrewery;
      }
    } catch (error) {
      throw error;
    }
  }

  async getStyleByName(styleName) {
    try {
      const [rows] = await this.connection
        .promise()
        .query("SELECT * FROM styles WHERE style_name = ?", [styleName]);

      if (rows.length > 0) {
        return rows[0]; // Return the first style matching the name
      } else {
        // Handle the case when the style is not found
        return null; // Or you can throw an error or handle it differently
      }
    } catch (error) {
      throw error;
    }
  }

  updateBeerRating(beerId, newRating) {
    return this.connection
      .promise()
      .query("UPDATE beers SET rating_id = ? WHERE id = ?", [
        newRating,
        beerId,
      ]);
  }

  deleteBeerByName(name) {
    return this.connection
      .promise()
      .query(`DELETE FROM beers WHERE name = ?`, [name]);
  }

  deleteBreweryByName(name) {
    return this.connection
      .promise()
      .query(`DELETE FROM breweries WHERE brewery_name = ?`, [name]);
  }

  async deleteStyleByName(styleName) {
    try {
      const result = await this.connection
        .promise()
        .query("DELETE FROM styles WHERE style_name = ?", [styleName]);

      if (result.affectedRows > 0) {
        // Style deleted successfully
        console.log(`${styleName} has been deleted.`);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DB(connection);
