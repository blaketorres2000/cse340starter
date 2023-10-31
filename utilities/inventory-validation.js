const Util = require(".");
const { body, validationResult } = require("express-validator");
const classificationModel = require("../models/inventory-model");
const inv_validate = {};

/* ******************************
 * Check classification data and return errors
 * or continue to the management view
 * ***************************** */
inv_validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .custom(async (classification_name) => {
        const classificationExists =
          await classificationModel.checkExistingClassification(
            classification_name
          );

        if (classificationExists) {
          console.log("Classification already exists");
          throw new Error("Classification name already exists.");
        }

        // Custom validation to check for spaces or special characters
        if (
          /\s/.test(classification_name) ||
          /[!@#$%^&*(),.?":{}|<>]/.test(classification_name)
        ) {
          throw new Error(
            "Classification name cannot contain spaces or special characters."
          );
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to Classification
 * ***************************** */
inv_validate.checkClassData = async (req, res, next) => {
  let nav = await Util.getNav();
  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Handle validation errors, render a form with error messages
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  New Vehicle Data Validation Rules
 * ********************************* */
inv_validate.addVehicleRules = () => {
  return [
    // Make is required and must contain 3 characters minimum
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage(
        "Please provide a vehicle make with a minimum of 3 characters."
      ),

    // Model is required and must contain 3 characters minimum
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage(
        "Please provide a vehicle model with a minimum of 3 characters."
      ),

    // Description is required
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle description."),

    // Image path is required
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    // Thumbnail path is required
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),

    // Price is required and must be numeric
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Please provide a numerical price."),

    // Year is required and must be a 4 digit year
    body("inv_year")
      .trim()
      .isLength({ min: 4 })
      .isNumeric()
      .withMessage("Please provide a 4 digit year."),

    // Miles is required and must be numeric
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Please provide a numerical mileage."),

    // Color is required
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),
  ];
};

/* ******************************
 * Check data and return errors or continue to Management View
 * ***************************** */
inv_validate.checkVehicleData = async (req, res, next) => {
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    res.render("inv/add-vehicle", {
      errors,
      title: "Add New Vehicle",
      nav,
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
    });
    return;
  }
  next();
};

module.exports = inv_validate;
