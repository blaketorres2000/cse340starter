// const utilities = require("../utilities/")
// const baseController = {}

// baseController.buildHome = async function(req, res){
//   const nav = await utilities.getNav()
//   res.render("index", {title: "Home", nav})
// }

// module.exports = baseController

const utilities = require("../utilities/");

const baseController = {};

baseController.buildHome = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("index", { title: "Home", nav });
  } catch (error) {
    // Handle the error here, for example, by logging it or rendering an error page.
    console.error("An error occurred in baseController.buildHome:", error);
    // You can also pass the error to an error handling middleware.
    next(error);
  }
};

module.exports = baseController;
