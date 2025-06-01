const form = document.getElementById("registrationForm");
const tableBody = document.querySelector("#entriesTable tbody");

window.onload = function () {
  const entries = JSON.parse(localStorage.getItem("user-entries")) || [];
  entries.forEach(displayEntry);
};


function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function validateField(id, message, condition) {
  const errorElement = document.getElementById(id + "Error");
  if (condition) {
    errorElement.textContent = message;
    return false;
  } else {
    errorElement.textContent = "";
    return true;
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value;
  const acceptTerms = document.getElementById("acceptTerms").checked;

 
  const isNameValid = validateField("name", "Please fill this field", name === "");
  const isEmailValid = validateField("email", "Please fill this field", email === "") &&
    validateField("email", "Email must be valid (contain @)", !/^[^@]+@[^@]+\.[^@]+$/.test(email));
  const isPasswordValid = validateField("password", "Please fill this field", password === "");
  const isDobValid = validateField("dob", "Please fill this field", dob === "") &&
    validateField("dob", "Age must be between 18 and 55", (dob && (calculateAge(dob) < 18 || calculateAge(dob) > 55)));
  const isTermsValid = validateField("terms", "Please accept the terms", !acceptTerms);

  if (!(isNameValid && isEmailValid && isPasswordValid && isDobValid && isTermsValid)) {
    return; 
  }

  const entry = {
    name,
    email,
    password,
    dob,
    acceptTerms
  };

  const entries = JSON.parse(localStorage.getItem("user-entries")) || [];
  entries.push(entry);
  localStorage.setItem("user-entries", JSON.stringify(entries));

  displayEntry(entry);
  form.reset();
});

function displayEntry(entry) {
  const row = tableBody.insertRow();
  row.insertCell(0).textContent = entry.name;
  row.insertCell(1).textContent = entry.email;
  row.insertCell(2).textContent = entry.password;
  row.insertCell(3).textContent = entry.dob;
  row.insertCell(4).textContent = entry.acceptTerms ? "true" : "false";
}
