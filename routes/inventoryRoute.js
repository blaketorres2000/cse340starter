const Util = require("../utilities");
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

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

// Route to build the inventory management view
router.get(
  "",
  Util.handleErrors(invController.renderManagementView)
);

// Route to build the add new classification view
router.get(
  "/add-classification",
  Util.handleErrors(invController.renderAddClassificationView)
);

// Process the add-classification attempt
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassData,
  Util.handleErrors(invController.addClassification)
);

// Route to build the add new vehicle view
router.get(
  "/add-vehicle",
  Util.handleErrors(invController.renderAddVehicleView)
);


// Process adding new vehicle
router.post(
  "/add-vehicle",
  invValidate.addVehicleRules(),
  invValidate.checkVehicleData,
  Util.handleErrors(invController.addVehicle)
);

// New route for rendering the 'add-vehicle' view with the classification dropdown
router.get('/add-vehicle', async (req, res) => {
  const selectedClassificationId = req.query.selectedClassificationId;
  const dropdown = await Util.getClassificationDropdown(req, res, null, selectedClassificationId);
  res.render('add-vehicle', { dropdown });
});

// Add a catch-all route for 404 errors
router.use(Util.handleErrors);

(module.exports = router), Util;
