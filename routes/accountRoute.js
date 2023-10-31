const Util = require("../utilities");
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const logValidate = require("../utilities/account-validation");

// Define the GET route for the "/login" path
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Define the GET route for the "/register" path
router.get("/register", Util.handleErrors(accountController.buildRegister));

// Process the login attempt
router.post("/login", 
    logValidate.loginRules(),
    logValidate.checkLogData,
    Util.handleErrors(accountController.loginAccount)
    );

// Process the POST request from the registration form
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
);

module.exports = router;
