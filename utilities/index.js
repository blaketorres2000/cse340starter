const invModel = require("../models/inventory-model.js");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Builds the dropdown classification list
 * ************************************ */
// Util.getClassificationDropdown = async function (req, res, next) {
//   let data = await invModel.getClassifications();
//   let dropdown = '<select name="classification_id">';
//   data.rows.forEach((row) => {
//     dropdown += '<option id="dropdownId" value="' + (row.classification_id) + '">' + (row.classification_name) + '</option>';
//   });
//   dropdown += '</select>';
//   return dropdown;
// }

Util.getClassificationDropdown = async function (
  req,
  res,
  next,
  selectedClassificationId
) {
  let data = await invModel.getClassifications();
  let dropdown = '<select name="classification_id">';
  data.rows.forEach((row) => {
    dropdown += '<option value="' + row.classification_id + '"';
    if (row.classification_id === selectedClassificationId) {
      dropdown += " selected";
    }
    console.log("This sucks");
    dropdown += ">" + row.classification_name + "</option>";
  });
  dropdown += "</select>";
  return dropdown;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle details view HTML
 * ************************************ */
Util.buildVehicleDetail = function (vehicle) {
  const vehicleDetailHTML = `
  <div class="vehicle-detail">
    <h1>${vehicle.make} ${vehicle.model}</h1>
    <img src="${vehicle.fullSizeImage}" alt="${vehicle.make} ${
    vehicle.model
  }" />
    <p>Year: ${vehicle.year}</p>
    <p>Price: $${new Intl.NumberFormat("en-US").format(vehicle.price)}</p>
    <p>Mileage: ${new Intl.NumberFormat("en-US").format(vehicle.mileage)}</p>
    <!-- Add more details here -->
  </div>
  `;
  return vehicleDetailHTML;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
