const Util = require(".");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          throw new Error("Email does not exist.");
        }
      }),
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password incorrect."),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
  const { account_email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await Util.getNav();
    return res.render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      account_email,
    });
  } else {
    next();
  }
};

/* ******************************
 * Middleware to check JWT token and account type
 * ***************************** */
validate.checkAdminAccess = async (req, res, next) => {
  try {
    // Check if the user is logged in (JWT token exists)
    if (!req.cookies.jwt) {
      req.flash("error", "Please log in");
      return res.redirect("/account/login");
    }

    // Verify the JWT token
    const accountData = await jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Check the account type
    if (
      accountData.account_type === "Employee" ||
      accountData.account_type === "Admin"
    ) {
      // User has the necessary account type, grant access
      res.locals.accountData = accountData;
      res.locals.loggedin = 1;
      return next();
    } else {
      // User does not have the required account type
      req.flash("error", "Access denied. Insufficient privileges.");
      return res.redirect("/account/login");
    }
  } catch (err) {
    console.error("JWT Verification Error:", err);
    req.flash("error", "Please log in");
    return res.clearCookie("jwt").redirect("/account/login");
  }
};

/* **********************************
 * Update Account Data Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required
    // if email is being changed, it cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const account = await accountModel.getAccountById(account_id);

        if (account_email != account.account_email) {
          const emailExists = await accountModel.checkExistingEmail(
            account_email
          );

          // Check if emailExists is null before accessing count property
          if (
            emailExists &&
            emailExists.count != null &&
            emailExists.count != 0
          ) {
            throw new Error("Email exists. Please use a different email");
          }
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    res.render("account/manage-account", {
      errors,
      title: "Account Management",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
    return;
  }
  next();
};

/* **********************************
 * Change Password Validation Rules
 * ********************************* */
validate.changePasswordRules = () => {
  return [
    // new password is required and must be a strong password
    body("account_password")
    .custom((value, { req }) => {
      console.log("Received Password:", value);
      return true; // Continue with other validations
    })
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to password change
 * ***************************** */
validate.checkChangePasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    res.render("account/manage-account", {
      errors,
      title: "Account Management",
      nav,
    });
    return;
  }
  next();
};

module.exports = validate;
