const connection = require("./data/connection");
const inquirer = require("inquirer");
const { AutocompletePrompt } = import("inquirer-autocomplete-prompt");
const db = require("./data");
require("console.table");

inquirer.registerPrompt("autocomplete", AutocompletePrompt);

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
        case "Add new beer":
          addBeer();
          break;
        case "View beers by brewery":
          viewBeersByBrewery();
          break;
        case "View beers by rating":
          viewBeersByRating();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};

// !--- VIEW ALL BEERS ---! \\

const viewAllBeers = () => {
  db.seeAllBeers()
    .then(([rows]) => {
      let beers = rows;

      console.table(beers);
    })
    .then(() => mainMenu());
};

// !--- ADD BEER ---! \\

const addBeer = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the beer:",
      },
      {
        type: "input",
        name: "brewery_name",
        message: "Enter the name of the brewery:",
      },
      {
        type: "input",
        name: "style_name",
        message: "Enter the name of the style:",
      },
      {
        type: "input",
        name: "abv",
        message: "Enter the ABV:",
      },
      {
        type: "input",
        name: "rating_id",
        message: "Enter the rating ID:",
      },
      {
        type: "input",
        name: "date_drunk",
        message: "Enter the date drunk (YYYY-MM-DD):",
      },
      {
        type: "input",
        name: "location_name",
        message: "Enter the location name:",
      },
      {
        type: "input",
        name: "notes",
        message: "Enter notes:",
      },
    ])
    .then((answers) => {
      const {
        name,
        brewery_name,
        style_name,
        abv,
        rating_id,
        date_drunk,
        location_name,
        notes,
      } = answers;

      return db
        .getBreweryByName(brewery_name)
        .then((brewery) => {
          if (brewery) {
            // Brewery exists, add the beer with the existing brewery_id
            return db
              .addBeer(
                name,
                brewery_name,
                style_name,
                abv,
                rating_id,
                date_drunk,
                location_name,
                notes
              )
              .then(() => {
                mainMenu();
              });
          } else {
            // Brewery doesn't exist, prompt user to create a new entry
            return inquirer
              .prompt([
                {
                  type: "confirm",
                  name: "addBrewery",
                  message:
                    "Brewery not found. Do you want to add a new brewery? (Y/n)",
                },
              ])
              .then((answer) => {
                if (answer.addBrewery) {
                  // Prompt user for brewery details and add to database
                  return inquirer
                    .prompt([
                      {
                        type: "input",
                        name: "brewery_city",
                        message: "Enter the city of the brewery:",
                      },
                      {
                        type: "input",
                        name: "brewery_state",
                        message: "Enter the state of the brewery:",
                      },
                    ])
                    .then((breweryAnswers) => {
                      const { brewery_city, brewery_state } = breweryAnswers;
                      return db
                        .addBrewery(brewery_name, brewery_city, brewery_state)
                        .then(() => {
                          console.log("New brewery added to the database.");
                          console.log("Brewery Name:", brewery_name);
                          console.log("Brewery City:", brewery_city);
                          console.log("Brewery State:", brewery_state);
                          // Now add the beer with the newly created brewery_id
                          return db.addBeer(
                            name,
                            brewery_name,
                            style_name,
                            abv,
                            rating_id,
                            date_drunk,
                            location_name,
                            notes
                          );
                        })
                        .then(() => {
                          mainMenu();
                        })
                        .catch((error) => {
                          console.error("Error:", error);
                        });
                    });
                } else {
                  // Brewery not added, continue without adding a new beer
                  console.log("Brewery not added.");
                  // Add the beer with the provided brewery_name
                  return db
                    .addBeer(
                      name,
                      brewery_name,
                      style_name,
                      abv,
                      rating_id,
                      date_drunk,
                      location_name,
                      notes
                    )
                    .then(() => {
                      mainMenu();
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                    });
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
};

// !--- VIEW BEERS BY BREWERY ---! //

const viewBeersByBrewery = async () => {
  const { brewery_name } = await inquirer.prompt([
    {
      type: "input",
      name: "brewery_name",
      message: "Enter the name of the brewery to view beers:",
    },
  ]);

  try {
    const beers = await db.viewBeersByBrewery(brewery_name);
    if (beers.length === 0) {
      console.log("No beers found for the specified brewery.");
    } else {
      console.log("Beers by Brewery:", brewery_name);
      beers.forEach((beer) => {
        console.log("--------------------");
        console.log("Beer ID:", beer.id);
        console.log("Beer Name:", beer.name);
        console.log("Brewery Name:", beer.brewery_name);
        console.log("Style:", beer.style_name);
        console.log("ABV:", beer.abv);
        console.log("Rating:", beer.rating);
        console.log("Date Drunk:", beer.date_drunk);
        console.log("Location:", beer.location_name);
        console.log("Notes:", beer.notes);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mainMenu(); // Redirect to the main menu
  }
};

// !--- VIEW BY RATING ---! \\

const viewBeersByRating = async () => {
  const { rating } = await inquirer.prompt([
    {
      type: "input",
      name: "rating",
      message: "Enter the rating to view beers:",
    },
  ]);

  try {
    // Convert the input string to a decimal value
    const decimalRating = parseFloat(rating);

    const beersArray = await db.seeBeersBySingleRating(decimalRating);
    const beers = beersArray[0]; // Access the inner array

    if (beers.length === 0) {
      console.log("No beers found for the specified rating.");
    } else {
      console.log("Beers by Rating:", decimalRating.toFixed(2)); // Format rating to 2 decimal places
      beers.forEach((beer) => {
        console.log("--------------------");
        console.log("Beer ID:", beer.id);
        console.log("Beer Name:", beer.name);
        console.log("Brewery Name:", beer.brewery_name);
        console.log("Style:", beer.style_name);
        console.log("ABV:", beer.abv);

        const rating = parseFloat(beer.rating); // Parse rating to a float
        console.log("Rating:", rating.toFixed(2)); // Format rating to 2 decimal places

        console.log("Date Drunk:", beer.date_drunk);
        console.log("Location:", beer.location_name);
        console.log("Notes:", beer.notes);
      });
    }
    mainMenu(); // Redirect back to the main menu
  } catch (error) {
    console.error("Error:", error);
  }
};

const quit = () => {
  console.log("Goodbye!");
  process.exit();
};

init();
