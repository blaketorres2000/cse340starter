const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      data,
      grid,
    });
  } catch (error) {
    // Handle the error here, for example, by logging it or rendering an error page.
    console.error("An error occurred in invCont.buildByClassificationId:", error);
    // You can also pass the error to an error handling middleware.
    next(error);
  }
};

module.exports = invCont;
