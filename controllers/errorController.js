const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");
const invCont = {};


// Controller function for the intentional 500 error route
exports.triggerError = async function (req, res, next) {
    try {
    //   const inventoryId = req.params.inventoryId;
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