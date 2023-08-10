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
        case "Quit":
          quit();
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

      db.getBreweryByName(brewery_name)
        .then((brewery) => {
          if (brewery) {
            // Brewery exists, add the beer with the existing brewery_id
            db.addBeer(
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
                console.log("Beer added to database.");
              })
              .catch((error) => {
                console.error("Error adding beer:", error);
              });
          } else {
            // Brewery doesn't exist, prompt user to create a new entry
            inquirer
              .prompt([
                {
                  type: "confirm",
                  name: "addBrewery",
                  message:
                    "Brewery not found. Do you want to add a new brewery?",
                },
              ])
              .then((answer) => {
                if (answer.addBrewery) {
                  // Prompt user for brewery details and add to database
                  inquirer
                    .prompt([
                      {
                        type: "input",
                        name: "brewer_city",
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
                      db.addBrewery(brewery_name, brewery_city, brewery_state)
                        .then(() => {
                          console.log("Brewery added to database.");
                          // Now add the beer with the newly created brewery_id
                          db.addBeer(
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
                              console.log("Beer added to database.");
                            })
                            .catch((error) => {
                              console.error("Error adding beer:", error);
                            });
                        })
                        .catch((error) => {
                          console.error("Error adding brewery:", error);
                        });
                    });
                } else {
                  console.log("Please enter a valid brewery name.");
                }
              });
          }
        })
        .catch((error) => {
          console.error("Error checking brewery:", error);
        });
    });
};

const quit = () => {
  console.log("Goodbye!");
  process.exit();
};

init();
