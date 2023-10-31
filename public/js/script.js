// Hamburger Menu
function toggleMenu() {
  document.querySelector("nav").classList.toggle("responsive");
}

// Button to reveal/hide password
function togglePasswordVisibility() {
  const passwordInput = document.querySelector("#account_password");
  const passButton = document.querySelector("#passbutton");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passButton.textContent = "Hide Password";
  } else {
    passwordInput.type = "password";
    passButton.textContent = "Show Password";
  }
}

// Checking for active nav link
document.addEventListener("DOMContentLoaded", function () {
  // Your JavaScript code goes here
  const currentUrl = window.location.pathname;
  const navLinks = document.querySelectorAll("nav ul li a");

  for (const link of navLinks) {
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("active");
    }
  }
});

function setInputColor(input) {
  input.classList.remove("valid", "invalid");
  if (input.validity.valid && input.value.trim() !== "") {
    input.classList.add("valid");
  } else {
    input.classList.add("invalid");
  }
}

function validatePositiveNumber(input) {
  const value = input.value;
  if (/^[1-9][0-9]*(\.[0-9]+)?$/.test(value)) {
    input.classList.add("valid");
  } else {
    input.classList.add("invalid");
  }
}

validatePositiveNumber;
setInputColor;
