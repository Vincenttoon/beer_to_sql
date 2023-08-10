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
          addNewBeer();
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

const addNewBeer = () => {
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
    });
};

const quit = () => {
  console.log("Goodbye!");
  process.exit();
};

init();
