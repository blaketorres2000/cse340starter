const Util = require("../utilities");
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  Util.handleErrors(invController.buildByClassificationId)
);

// Route to retrieve a specific vehicle's information
router.get(
  "/detail/:inventoryId",
  Util.handleErrors(invController.showVehicleDetail)
);

// Add a catch-all route for 404 errors
router.use(Util.handleErrors);

module.exports = router, Util;
