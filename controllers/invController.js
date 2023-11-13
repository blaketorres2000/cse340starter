const invModel = require("../models/inventory-model");
const Util = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    if (data.length === 0) {
      // No vehicles found for the classification, display a message
      const className = `No current inventory for this vehicle class.`;
      res.render("./inventory/classification", {
        title: className,
        nav: await Util.getNav(),
        data: [],
        grid: [],
      });
    } else {
      // Vehicles exist, proceed to render the view
      const grid = await Util.buildClassificationGrid(data);
      let nav = await Util.getNav();
      const className = data[0].classification_name;
      res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        data,
        grid,
      });
    }
  } catch (error) {
    console.error(
      "An error occurred in invCont.buildByClassificationId:",
      error
    );
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

    const nav = await Util.getNav();
    res.render("./inventory/detail", {
      title:
        vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model,
      nav,
      vehicleDetailHTML: vehicle,
    });
  } catch (error) {
    console.error("An error occurred in invCont.showVehicleDetail:", error);
    next(error);
  }
};

/* ***************************
 *  Build Management View
 * ************************** */
invCont.renderManagementView = async function (req, res, next) {
  try {
    let nav = await Util.getNav();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } catch (error) {
    console.error(
      "An error occurred in inventoryController.renderManagementView:",
      error
    );
    next(error);
  }
};


/* ***************************
 *  Build Add-Classification View
 * ************************** */
invCont.renderAddClassificationView = async function (req, res, next) {
  try {
    let nav = await Util.getNav();

    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    });
  } catch (error) {
    console.error(
      "An error occurred in inventoryController.renderAddClassificationView:",
      error
    );
    next(error);
  }
};

/* ***************************
 *  Process New Classification Request
 * ************************** */
invCont.addClassification = async function (req, res) {
  try {
    const { classification_name } = req.body;

    const addClass = await invModel.addClassification(classification_name);

    if (addClass) {
      req.flash("notice", `${classification_name} has been added.`);
      // Clear and rebuild the navigation before rendering the management view
      const nav = await Util.getNav();
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, adding the classification failed.");
      // Render the add-classification view with an error message
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
      });
    }
  } catch (error) {
    console.log("Error in adding classification:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ***************************
 *  Build Add-Vehicle View
 * ************************** */
invCont.renderAddVehicleView = async function (req, res, next) {
  try {
    let nav = await Util.getNav();
    let classificationDropdown = await Util.getClassificationDropdown();
    res.render("./inventory/add-vehicle", {
      title: "Add New Vehicle",
      nav,
      classificationDropdown,
    });
  } catch (error) {
    console.error(
      "An error occurred in inventoryController.renderAddVehicleView:",
      error
    );
    next(error);
  }
};

/* ***************************
 *  Process New Vehicle Request
 * ************************** */
invCont.addVehicle = async function (req, res) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body;

    const addNewVehicle = await invModel.addVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    );

    if (addNewVehicle) {
      req.flash(
        "notice",
        `The ${inv_make} ${inv_model} has been added to inventory.`
      );
      // Clear and rebuild the navigation before rendering the management view
      let nav = await Util.getNav();
        res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, adding the vehicle failed.");
      let classificationDropdown = await Util.getClassificationDropdown();
      // Render the add-vehicle view with an error message
      res.status(501).render("./inventory/add-vehicle", {
        title: "Add New Vehicle",
        nav,
        classificationDropdown,
      });
    }
  } catch (error) {
    console.log("Error in adding vehicle:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = invCont;
