const inquirer = require("inquirer");
const { AutocompletePrompt } = import("inquirer-autocomplete-prompt");
const db = require("./data");
require("console.table");

inquirer.registerPrompt("autocomplete", AutocompletePrompt);

const init = () => {
  mainMenu();
};

// !--- START MAIN MENU ---! \\
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
          "View beers by rating", // Done
          "View beers by style", // Done
          "Update beer rating", // Done
          "More Add", // Done
          "More View", // Done
          "Deletions", // Done
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
        case "Update beer rating":
          updateBeerRatingByName();
          break;
        case "More Add":
          moreAdd();
          break;
        case "More View":
          moreView();
          break;
        case "Deletions":
          deletions();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};

// !--- START VIEW ALL BEERS ---! \\

const viewAllBeers = async () => {
  db.seeAllBeers()
    .then(([rows]) => {
      let beers = rows;

      console.table(beers);
    })
    .then(() => mainMenu());
};

// !--- START ADD BEER ---! \\

const addBeer = async () => {
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
        message: "Enter the rating ID (20 = 5.00, 10 = 2.50, 1 = 0.25):",
      },
      {
        type: "input",
        name: "date_drunk",
        message: "Enter the date drunk (YYYY-MM-DD):",
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

// !--- START VIEW BEER BY NAME ---! \\
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

      // Create a new array of objects with formatted date_drunk and without the "id" and properties
      const formattedBeers = beers.map((beer) => {
        const { id, date_drunk, ...beerWithoutIdAndDate } = beer;
        const formattedDate = new Date(date_drunk).toLocaleDateString("en-US");
        return { ...beerWithoutIdAndDate, date_drunk: formattedDate };
      });

      console.table(formattedBeers); // Display the formatted array
    }
    mainMenu(); // Redirect back to the main menu
  } catch (error) {
    console.error("Error:", error);
  }
};

// !--- START VIEW BEERS BY BREWERY ---! \\

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

      // Create a new array of objects with formatted date_drunk and without the "id", and "brewery_name" properties
      const formattedBeers = beers.map((beer) => {
        const { id, brewery_name, date_drunk, ...beerWithoutIdBreweryAndDate } =
          beer;
        const formattedDate = new Date(date_drunk).toLocaleDateString("en-US");
        return {
          ...beerWithoutIdBreweryAndDate,
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

// !--- START VIEW BY RATING ---! \\

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

// !--- START VIEW BEERS BY STYLE ---! \\

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

      // Create a new array of objects with formatted date_drunk and without the "id", "style_name", and properties
      const formattedBeers = beers.map((beer) => {
        const { id, style_name, ...beerWithoutIdAndStyle } = beer;
        const formattedDate = new Date(beer.date_drunk).toLocaleDateString(
          "en-US"
        );
        return { ...beerWithoutIdAndStyle, date_drunk: formattedDate };
      });

      console.table(formattedBeers); // Display the formatted array
    }
    mainMenu(); // Redirect back to the main menu
  } catch (error) {
    console.error("Error:", error);
  }
};

const updateBeerRatingByName = async () => {
  try {
    const { name, newRating } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the beer to update the rating:",
      },
      {
        type: "input",
        name: "newRating",
        message: "Enter the new rating (eg: #.## from 0.25 to 5.00):",
      },
    ]);

    await db.updateBeerRatingByName(name, newRating);
    console.log(`${name}'s rating has been updated to ${newRating}.`);
    mainMenu();
  } catch (error) {
    console.error("Error:", error);
    mainMenu();
  }
};

const moreView = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "moreView",
        message: "Please select an option:",
        choices: [
          "View all Breweries",
          "View all Styles",
          "View all Ratings",
          "Main Menu",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      switch (response.moreView) {
        case "View all Breweries":
          viewAllBreweries();
          break;
        case "View all Styles":
          viewAllStyles();
          break;
        case "View all Ratings":
          viewAllRatings();
          break;
        case "Main Menu":
          mainMenu();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};

// !--- VIEW ALL BREWERIES ---! \\

const viewAllBreweries = async () => {
  db.seeAllBreweries()
    .then(([rows]) => {
      let breweries = rows;

      console.table(breweries);
    })
    .then(() => moreView());
};

// !--- VIEW ALL STYLES ---! \\

const viewAllStyles = async () => {
  db.seeAllStyles()
    .then(([rows]) => {
      let styles = rows;

      console.table(styles);
    })
    .then(() => moreView());
};

// !--- VIEW ALL RATINGS ---! \\

const viewAllRatings = async () => {
  db.seeAllRatings()
    .then(([rows]) => {
      let ratings = rows;

      console.table(ratings);
    })
    .then(() => moreView());
};

// !--- MORE ADD ---! \\

const moreAdd = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "moreAdd",
        message: "Please select an option:",
        choices: ["Add Brewery", "Add Style", "Main Menu", "Quit"],
      },
    ])
    .then((response) => {
      switch (response.moreAdd) {
        case "Add Brewery":
          addBrewery();
          break;
        case "Add Style":
          addStyle();
          break;
        case "Main Menu":
          mainMenu();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};

// !--- ADD BREWERY ---! \\

const addBrewery = async () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the brewery:",
      },
      {
        type: "input",
        name: "city",
        message: "Enter the city of the brewery:",
      },
      {
        type: "input",
        name: "state",
        message: "Enter the state of the brewery:",
      },
    ])
    .then((answers) => {
      const { name, city, state } = answers;

      return db
        .addBrewery(name, city, state)
        .then(() => {
          console.log("New brewery added to the database.");
          console.log("Brewery Name:", name);
          console.log("Brewery City:", city);
          console.log("Brewery State:", state);
          mainMenu();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// !--- ADD STYLE ---! \\

const addStyle = async () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the style:",
      },
    ])
    .then((answers) => {
      const { name } = answers;

      return db
        .addStyle(name)
        .then(() => {
          console.log("New style added to the database.");
          console.log("Style Name:", name);
          mainMenu();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// !--- DELETIONS MENU ---! \\
const deletions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "deletion",
        message: "Please select an option:",
        choices: [
          "Delete Beer",
          "Delete Brewery",
          "Delete Style",
          "Main Menu",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      switch (response.deletion) {
        case "Delete Beer":
          deleteBeer();
          break;
        case "Delete Brewery":
          deleteBrewery();
          break;
        case "Delete Style":
          deleteStyle();
          break;
        case "Main Menu":
          mainMenu();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};

// !--- DELETE BEER ---! \\

const deleteBeer = async () => {
  try {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the beer to delete:",
      },
    ]);

    const beer = await db.findBeerByName(name);

    if (beer.length === 0) {
      console.log("No beer found with the specified name.");
      mainMenu();
    } else {
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Are you sure you want to delete ${name}?`,
          default: false,
        },
      ]);

      if (confirm) {
        await db.deleteBeerByName(name);
        console.log(`${name} has been deleted.`);
      } else {
        console.log("Deletion canceled.");
      }

      mainMenu();
    }
  } catch (error) {
    console.error("Error:", error);
    mainMenu();
  }
};

// !--- DELETE BREWERY ---! \\

const deleteBrewery = async () => {
  try {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the brewery to delete:",
      },
    ]);

    const brewery = await db.getBreweryByName(name);

    if (!brewery) {
      console.log("No brewery found with the specified name.");
      mainMenu();
    } else {
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `DEVELOPER NOTE: If your desired brewery is assigned to a beer, it will not be deleted.
          Are you sure you want to delete ${name}?
          `,
          default: false,
        },
      ]);

      if (confirm) {
        await db.deleteBreweryByName(name);
        console.log(`${name} has been deleted.`);
      } else {
        console.log("Deletion canceled.");
      }

      mainMenu();
    }
  } catch (error) {
    console.error("Error:", error);
    mainMenu();
  }
};

// !--- DELETE STYLE ---! \\

const deleteStyle = async () => {
  try {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the style to delete:",
      },
    ]);

    // Check if the style exists
    const style = await db.getStyleByName(name);

    if (!style) {
      console.log("No style found with the specified name.");
      mainMenu();
    } else {
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Are you sure you want to delete the style "${name}"?`,
          default: false,
        },
      ]);

      if (confirm) {
        await db.deleteStyleByName(name);
        console.log(`Style "${name}" has been deleted.`);
      } else {
        console.log("Deletion canceled.");
      }

      mainMenu();
    }
  } catch (error) {
    console.error("Error:", error);
    mainMenu();
  }
};

// !--- QUIT ---! \\
const quit = () => {
  console.log("Goodbye!");
  process.exit();
};

init();
