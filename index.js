const connection = require("./data/connection");
const inquirer = require("inquirer");
const { AutocompletePrompt } = require("inquirer-autocomplete-prompt");
const db = require("./data");
require("console.table");

function getBreweryNames() {
  return new Promise((resolve, reject) => {
    // Execute a query to retrieve the brewery names from the database
    // and pass the results to the `resolve` function
    connection.query("SELECT name FROM breweries", (error, results) => {
      if (error) {
        reject(error);
      } else {
        // Map the results to an array of brewery names and pass it to the `resolve` function
        const breweryNames = results.map((result) => result.name);
        resolve(breweryNames);
      }
    });
  });
}

// function to get all locations
function getLocations() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM locations", (error, results) => {
      if (error) {
        reject(error);
      } else {
        const locations = results.map((result) => result.name);
        resolve(locations);
      }
    });
  });
}

// function to get all ratings
function getRatings() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM ratings", (error, results) => {
      if (error) {
        reject(error);
      } else {
        const ratings = results.map((result) => result.value);
        resolve(ratings);
      }
    });
  });
}

// function to get all styles
function getStyles() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM styles", (error, results) => {
      if (error) {
        reject(error);
      } else {
        const styles = results.map((result) => result.name);
        resolve(styles);
      }
    });
  });
}

// Define a prompt function for each type of data
const promptBrewery = async () => {
  const response = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "brewery",
      message: "Select brewery:",
      source: async (answersSoFar, input) => {
        const results = breweries.filter((option) =>
          option.toLowerCase().includes(input.toLowerCase())
        );
        return results;
      },
    },
  ]);
  return response.brewery;
};

const promptLocation = async () => {
  const response = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "location",
      message: "Select location:",
      source: async (answersSoFar, input) => {
        const results = locations.filter((option) =>
          option.toLowerCase().includes(input.toLowerCase())
        );
        return results;
      },
    },
  ]);
  return response.location;
};

const promptRating = async () => {
  const response = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "rating",
      message: "Select rating:",
      source: async (answersSoFar, input) => {
        const results = ratings.filter((option) =>
          option.toLowerCase().includes(input.toLowerCase())
        );
        return results;
      },
    },
  ]);
  return response.rating;
};

const promptStyle = async () => {
  const response = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "style",
      message: "Select style:",
      source: async (answersSoFar, input) => {
        const results = styles.filter((option) =>
          option.toLowerCase().includes(input.toLowerCase())
        );
        return results;
      },
    },
  ]);
  return response.style;
};

const init = () => {
  mainMenu();
};

const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "mainMenu",
        message: "Please select an option:",
        choices: [
          "View all beers",
          "Add new beer",
          "View beers by brewery",
          "View beers by rating",
          "View beers by style",
          "Update beer rating",
          "Add other",
          "View other",
          "Delete beer",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      switch (response.mainMenu) {
        case "View all beers":
          viewAllBeers();
          break;
      }
    });
};

const viewAllBeers = () => {
  db.seeAllBeers()
    .then(([rows]) => {
      let beers = rows;

      console.table(beers);
    })
    .then(() => mainMenu());
};

async function addBeer() {
  // Prompt user for beer information
  const beerName = await promptBeerName();
  const breweryId = await promptBrewery();
  const style = await promptStyle();
  const abv = await promptAbv();
  const location = await promptLocation();
  const notes = await promptNotes();
  const ratingId = await promptRating();

  // Check if the brewery already exists, add it if it does not
  const [existingBrewery] = await db.query(
    "SELECT id FROM breweries WHERE name = ?",
    [breweryId]
  );
  if (!existingBrewery) {
    const result = await db.query("INSERT INTO breweries (name) VALUES (?)", [
      breweryId,
    ]);
    breweryId = result.insertId;
  }

  // Check if the location already exists, add it if it does not
  let existingLocation = null;
  if (location) {
    [existingLocation] = await db.query(
      "SELECT id FROM locations WHERE name = ?",
      [location]
    );
    if (!existingLocation) {
      const result = await db.query("INSERT INTO locations (name) VALUES (?)", [
        location,
      ]);
      existingLocation = {
        id: result.insertId,
        name: location,
      };
    }
  }

  // Check if the style already exists, add it if it does not
  let existingStyle = null;
  if (style) {
    [existingStyle] = await db.query("SELECT id FROM styles WHERE name = ?", [
      style,
    ]);
    if (!existingStyle) {
      const result = await db.query("INSERT INTO styles (name) VALUES (?)", [
        style,
      ]);
      existingStyle = {
        id: result.insertId,
        name: style,
      };
    }
  }

  // Insert the new beer into the database
  const result = await db.query(
    "INSERT INTO beers (name, brewery_id, style_id, abv, location_id, notes, rating_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      beerName,
      existingBrewery.id,
      existingStyle ? existingStyle.id : null,
      abv,
      existingLocation ? existingLocation.id : null,
      notes,
      ratingId,
    ]
  );
  console.log(`Added ${beerName} to the database!`);
}

init();
