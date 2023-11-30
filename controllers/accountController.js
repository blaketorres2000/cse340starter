const Util = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const accountController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res, next) {
  try {
    let nav = await Util.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } catch (error) {
    console.log("Error in buildLogin:", error);
    next(error);
  }
};

/* ****************************************
 *  Process Login
 * *************************************** */
accountController.loginAccount = async function (req, res) {
  let nav = await Util.getNav();
  const { account_email, account_password } = req.body;

  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      // Set first name in res.locals
      res.locals.account_firstname = accountData.account_firstname;

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000,
        path: "/",
      });
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
};

/* ****************************************
 *  Deliver Registration view
 * *************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    let nav = await Util.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  } catch (error) {
    console.log("Error in buildRegister:", error);
    next(error);
  }
};

/* ****************************************
 *  Process Registration
 * *************************************** */
accountController.registerAccount = async function (req, res) {
  try {
    let nav = await Util.getNav();
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
      console.log("Error hashing password:", error);
      req.flash(
        "notice",
        "Sorry, there was an error processing the registration."
      );
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
      return;
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations ${account_firstname}, you're registered. Please log in.`
      );
      const nav = await Util.getNav();
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      });
    }
  } catch (error) {
    console.log("Error in registerAccount:", error);
    res.status(500).send("Internal Server Error");
  }
};

/* ****************************************
 *  Deliver account management view
 * *************************************** */
accountController.buildManageAccount = async function (req, res, next) {
  try {
    let nav = await Util.getNav();
    res.render("account/manage-account", {
      title: "Account Management",
      nav,
      errors: null,
      loggedin: res.locals.loggedin,
    });
  } catch (error) {
    console.log("Error in buildManageAccount:", error);
    next(error);
  }
};

/* ****************************************
 *  Process Account Update
 * *************************************** */
accountController.updateAccount = async function (req, res) {
  try {
    let nav = await Util.getNav();
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    } = req.body;

    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    );

    if (updateResult) {
      // Fetch the updated account data
      const updatedAccountData = await accountModel.getAccountById(account_id);

      // Generate a new JWT token with the updated data
      const updatedAccessToken = jwt.sign(
        updatedAccountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      );

      // Set the new JWT token in the response cookies
      res.cookie("jwt", updatedAccessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000,
        path: "/",
      });

      req.flash("notice", "Account information updated successfully.");
      res.render("account/manage-account", {
        title: "Account Management",
        nav,
      });
    } else {
      req.flash("notice", "Failed to update account information.");
      res.status(500).render("account/manage-account", {
        title: "Account Management",
        nav,
      });
    }
  } catch (error) {
    console.log("Error in updateAccount:", error);
    res.status(500).send("Internal Server Error");
  }
};
/* ****************************************
 *  Process Change Password
 * *************************************** */
accountController.changePassword = async function (req, res) {
  try {
    let nav = await Util.getNav();
    const { account_id, account_password } = req.body;

    // Perform any necessary validation here...

    // Hash the new password before storing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
      console.log("Error hashing password:", error);
      req.flash("notice", "Failed to update password.");
      res.status(500).render("account/manage-account", {
        title: "Account Management",
        nav,
      });
      return;
    }

    const updatePasswordResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    );

    if (updatePasswordResult) {
      req.flash("notice", "Password updated successfully.");
      // Redirect or render as needed
      res.render("account/manage-account", {
        title: "Account Management",
        nav,
      });
    } else {
      req.flash("notice", "Failed to update password.");
      res.status(500).render("account/manage-account", {
        title: "Account Management",
        nav,
      });
    }
  } catch (error) {
    console.log("Error in changePassword:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = accountController;
