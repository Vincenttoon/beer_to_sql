const connection = require("./data/connection");
const inquirer = require("inquirer");
const { AutocompletePrompt } = import("inquirer-autocomplete-prompt");
const db = require("./data");
require("console.table");

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

const quit = () => {
  console.log("Goodbye!");
  process.exit();
};

init();
