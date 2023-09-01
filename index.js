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
          "View all beers", // Done
          "Add new beer", // Done, with bugs
          "View beer by name", // Done
          "View beers by brewery", // Done
          "View beers by rating", // Done, but could stand to be reordered
          "View beers by style", // Done
          "Add brewery",
          "Add style",
          "Delete beer",
          "Delete brewery",
          "View other", // See ratings, see all styles, see all breweries
          "Quit", // Done
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
        case "View beer by name":
          viewBeerByName();
          break;
        case "View beers by brewery":
          viewBeersByBrewery();
          break;
        case "View beers by rating":
          viewBeersByRating();
          break;
        case "View beers by style":
          viewBeersByStyle();
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

// !--- VIEW BEER BY NAME ---! \\
const viewBeerByName = async () => {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the beer:",
    },
  ]);

  try {
    const beerArray = await db.findBeerByName(name);
    const beers = beerArray[0];

    if (!beers) {
      console.log("No beer found with the specified name.");
    } else {
      console.log("Beer Details:");
      console.log("--------------------");

      // Create a new array of objects with formatted date_drunk and without the "id" and "location_name" properties
      const formattedBeers = beers.map((beer) => {
        const {
          id,
          location_name,
          date_drunk,
          ...beerWithoutIdLocationAndDate
        } = beer;
        const formattedDate = new Date(date_drunk).toLocaleDateString("en-US");
        return { ...beerWithoutIdLocationAndDate, date_drunk: formattedDate };
      });

      console.table(formattedBeers); // Display the formatted array
    }
    mainMenu(); // Redirect back to the main menu
  } catch (error) {
    console.error("Error:", error);
  }
};

// !--- VIEW BEERS BY BREWERY ---! \\

const viewBeersByBrewery = async () => {
  const { brewery_name } = await inquirer.prompt([
    {
      type: "input",
      name: "brewery_name",
      message: "Enter the name of the brewery to view beers:",
    },
  ]);

  try {
    const beers = await db.seeBeersByBrewery(brewery_name);
    if (beers.length === 0) {
      console.log("No beers found for the specified brewery.");
    } else {
      console.log("Beers by:", brewery_name);
      console.log("--------------------");

      // Create a new array of objects with formatted date_drunk and without the "id", "location_name", and "brewery_name" properties
      const formattedBeers = beers.map((beer) => {
        const {
          id,
          location_name,
          brewery_name,
          date_drunk,
          ...beerWithoutIdLocationBreweryAndDate
        } = beer;
        const formattedDate = new Date(date_drunk).toLocaleDateString("en-US");
        return {
          ...beerWithoutIdLocationBreweryAndDate,
          date_drunk: formattedDate,
        };
      });

      console.table(formattedBeers); // Display the formatted array
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
      message: "Please enter ratings in '#.##' format.",
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
      console.log("--------------------");

      // Create a new array of objects with formatted date_drunk
      const formattedBeers = beers.map((beer) => {
        const rating = parseFloat(beer.rating); // Parse rating to a float
        const formattedDate = new Date(beer.date_drunk).toLocaleDateString(
          "en-US"
        );
        return {
          "Brewery Name": beer.brewery_name,
          "Beer Name": beer.name,
          ABV: beer.abv,
          // "Rating": rating.toFixed(2), // Format rating to 2 decimal places
          "Date Drunk": formattedDate,
          Notes: beer.notes,
        };
      });

      const tableData = formattedBeers.map((beer) => ({
        "Brewery Name": beer["Brewery Name"],
        "Beer Name": beer["Beer Name"],
        ABV: beer["ABV"],
        // "Rating": beer["Rating"],
        "Date Drunk": beer["Date Drunk"],
        Notes: beer["Notes"],
      }));

      console.table(tableData); // Display the formatted array
    }
    mainMenu(); // Redirect back to the main menu
  } catch (error) {
    console.error("Error:", error);
  }
};

// !--- VIEW BEERS BY STYLE ---! \\

const viewBeersByStyle = async () => {
  const { style } = await inquirer.prompt([
    {
      type: "input",
      name: "style",
      message: "Enter the style to view beers:",
    },
  ]);

  try {
    const beersArray = await db.seeBeersByStyle(style);
    const beers = beersArray[0];

    if (beers.length === 0) {
      console.log("No beers found for the specified style.");
    } else {
      console.log("Beers by Style:", style);
      console.log("--------------------");

      // Create a new array of objects with formatted date_drunk and without the "id", "style_name", and "location_name" properties
      const formattedBeers = beers.map((beer) => {
        const {
          id,
          style_name,
          location_name,
          ...beerWithoutIdStyleAndLocation
        } = beer;
        const formattedDate = new Date(beer.date_drunk).toLocaleDateString(
          "en-US"
        );
        return { ...beerWithoutIdStyleAndLocation, date_drunk: formattedDate };
      });

      console.table(formattedBeers); // Display the formatted array
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
