const connection = require("./data/connection");
const inquirer = require("inquirer");
const { AutocompletePrompt } = import("inquirer-autocomplete-prompt")
const db = require("./data");
require("console.table");

inquirer.registerPrompt('autocomplete', AutocompletePrompt);

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
  db.getBreweryNames()
    .then((breweryNames) => {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'beerName',
            message: 'Enter the name of the beer:'
          },
          {
            type: "autocomplete",
            name: "breweryName",
            message: "Enter the name of the brewery:",
            source: (answersSoFar, input) => {
              input = input || "";
              const filteredBreweries = breweryNames.filter(
                (breweryName) =>
                  breweryName.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
              if (!filteredBreweries.includes(input)) {
                filteredBreweries.push(new inquirer.Separator());
                filteredBreweries.push(input);
              }
              return filteredBreweries;
            },
            validate: (input) => {
              if (!breweryNames.includes(input)) {
                console.log("Brewery not found.");
                return inquirer.prompt([
                  {
                    type: "confirm",
                    name: "addBrewery",
                    message: "Do you want to add a new brewery?",
                  },
                ]).then((answer) => {
                  if (answer.addBrewery) {
                    return inquirer.prompt([
                      {
                        type: "input",
                        name: "breweryName",
                        message: "Enter the name of the brewery:",
                      },
                      {
                        type: "input",
                        name: "breweryCity",
                        message: "Enter the city of the brewery:",
                      },
                      {
                        type: "input",
                        name: "breweryState",
                        message: "Enter the state of the brewery:",
                      },
                    ]).then((answers) => {
                      return db.addBrewery(
                        answers.breweryName,
                        answers.breweryCity,
                        answers.breweryState
                      ).then(() => {
                        console.log("Brewery added to database.");
                        return true;
                      });
                    });
                  } else {
                    return "Please enter a valid brewery name.";
                  }
                });
              }
              return true;
            },
          },
        ])
    })
}

const quit = () => {
  console.log("Goodbye!");
  process.exit();
};

init();
