"use strict";

import { nextStep } from "/assets/js/forms/progressBar.js";

let userInfo;

const setUserForm = () => {
  const userFormContainer = document.querySelector("#user-form");
  const userForm = document.querySelector("#userForm");

  // Set birthDate form max date to today
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayDate = yyyy + "-" + mm + "-" + dd;
  userForm
    .querySelector("input[name='dbo']")
    .setAttribute("max", todayDate);

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    userInfo = {
      fname: userForm.fname.value,
      mname: userForm.mname.value,
      lname: userForm.lname.value,
      gender: userForm.gender.value,
      dbo: userForm.dbo.value,
      email: userForm.email.value,
      phone: userForm.phone.value,
      aadharNumber: userForm.aadharNumber.value,
    };

    nextStep();

    userFormContainer.style.display = "none";
    document.querySelector("#address-form").style.display = "block";

    console.log(userInfo);
  });
};

export { setUserForm, userInfo };
