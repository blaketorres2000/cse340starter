const Util = require("../utilities");
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const logValidate = require("../utilities/account-validation");


// Define the GET route for the "/login" path
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Logout route
router.get("/logout", Util.handleErrors((req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
}));

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

// Deliver the management view when clicking the link in the header
router.get("/manage",
  Util.checkLogin, Util.handleErrors(accountController.buildManageAccount)
);

// Process the POST request from the Account Update form
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  Util.handleErrors(accountController.updateAccount)
);

// Process the POST request from the Change Password form
router.post(
  "/change-password",
  regValidate.changePasswordRules(),
  regValidate.checkChangePasswordData,
  Util.handleErrors(accountController.changePassword)
);

// Default route for delivering the management view
router.get("/",
  Util.checkLogin, Util.handleErrors(accountController.buildManageAccount)
);

module.exports = router;
