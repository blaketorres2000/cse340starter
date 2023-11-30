const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    if (result.rowCount === 1) {
      // User found, return the user data
      return result.rows[0];
    }
    // User not found
    return null;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
 *   Update Account Information
 * *************************** */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const info = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return info.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Update Password
 * *************************** */
async function updatePassword(
  account_id,
  account_password
) {
  try {
    const sql =
    "UPDATE public.account SET account_password = $2 WHERE account_id = $1 RETURNING *";
    const info = await pool.query(sql, [
      account_id,
      account_password,
    ]);
    return info.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Get Account by ID
 * *************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("Error fetching account by ID");
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, updateAccount, updatePassword, getAccountById };
