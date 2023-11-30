const Util = require("../utilities");
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const accValidate = require("../utilities/account-validation");

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
router.get("", accValidate.checkAdminAccess, Util.handleErrors(invController.renderManagementView));

// Route to build the add new classification view
router.get(
  "/add-classification", accValidate.checkAdminAccess,
  Util.handleErrors(invController.renderAddClassificationView)
);

// Process the add-classification attempt
router.post(
  "/add-classification", accValidate.checkAdminAccess,
  invValidate.addClassificationRules(),
  invValidate.checkClassData,
  Util.handleErrors(invController.addClassification)
);

// Route to build the add new vehicle view
router.get(
  "/add-vehicle", accValidate.checkAdminAccess,
  Util.handleErrors(invController.renderAddVehicleView)
);

// // New route for rendering the 'add-vehicle' view with the classification dropdown
// router.get("/add-vehicle", accValidate.checkAdminAccess, async (req, res) => {
//   const selectedClassificationId = req.query.selectedClassificationId;
//   const dropdown = await Util.getClassificationDropdown(
//     req,
//     res,
//     null,
//     selectedClassificationId
//   );
//   res.render("add-vehicle", { dropdown });
// });

// Process adding new vehicle
router.post(
  "/add-vehicle", accValidate.checkAdminAccess,
  invValidate.addVehicleRules(),
  invValidate.checkVehicleData,
  Util.handleErrors(invController.addVehicle)
);


router.get(
  "/getInventory/:classification_id", accValidate.checkAdminAccess,
  Util.handleErrors(invController.getInventoryJSON)
);

// Route for editing a vehicle
router.post("/update", accValidate.checkAdminAccess,
invValidate.addVehicleRules(),
invValidate.checkUpdateData,
Util.handleErrors(invController.updateInventory)
);

// Route to build the edit vehicle view
router.get("/edit/:inv_id", accValidate.checkAdminAccess, Util.handleErrors(invController.editInventoryView));

// Route to build the delete vehicle view
router.get("/delete/:inv_id", accValidate.checkAdminAccess, Util.handleErrors(invController.deleteConfirmationView));

// Route to build the delete vehicle view
router.post("/delete_id", accValidate.checkAdminAccess,
Util.handleErrors(invController.deleteInventory)
);


// Add a catch-all route for 404 errors
router.use(Util.handleErrors);

(module.exports = router), Util;
