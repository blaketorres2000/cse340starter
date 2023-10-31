const Util = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

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
  try {
    let nav = await Util.getNav();
    const { account_email, account_password } = req.body;

    if (!account_password) {
      console.log("Password not provided.");
      req.flash("error", "Invalid email or password");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        account_email,
      });
    }

    // Check if the user with the provided email exists
    const user = await accountModel.checkExistingEmail(account_email);

    if (!user) {
      console.log("User not found:", account_email);
      req.flash("error", "Invalid email or password");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        account_email,
      });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(
      account_password,
      user.account_password
    );

    if (!passwordMatch) {
      console.log("Invalid password for user:", account_email);
      req.flash("error", "Invalid email or password");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        account_email,
      });
    }

    // If login is successful, set the user's session and redirect to the home page
    req.session.user = user;
    req.flash(
      "success",
      `Welcome ${user.account_firstname}! You are now logged in.`
    );
    res.status(200).redirect("../");
  } catch (error) {
    console.log("Error in loginAccount:", error);
    res.status(500).send("Internal Server Error");
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

module.exports = accountController;
