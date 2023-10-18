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

/* ***************************
 *  Controller function to show a specific vehicle's detail
 * ************************** */
invCont.showVehicleDetail = async function (req, res, next) {
  try {
    const inventoryId = req.params.inventoryId;
    const vehicle = await invModel.getVehicleDetail(inventoryId);

    if (!vehicle) {
      // Handle the case where the vehicle is not found (e.g., show an error page)
      return res.render(404, { title: "Vehicle Not Found. It must be lost." });
    }

    const nav = await utilities.getNav();
    res.render("inventory/detail", {
      title: vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model,
      nav,
      vehicleDetailHTML: vehicle, 
    });
  } catch (error) {
    console.error("An error occurred in invCont.showVehicleDetail:", error);
    next(error);
  }
};

module.exports = invCont;
