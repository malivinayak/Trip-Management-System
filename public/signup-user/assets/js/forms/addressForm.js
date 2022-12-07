"use strict";

import { nextStep, prevStep } from "/assets/js/forms/progressBar.js";

let addressInfo;

const setAddressForm = () => {
  const addressFormContainer = document.querySelector("#address-form");
  const addressForm = document.querySelector("#addressForm");
  const prevBtn = addressForm.querySelector(".prev-btn");

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();

    addressFormContainer.style.display = "none";
    document.querySelector("#user-form").style.display = "block";

    prevStep();
  });

  addressForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addressInfo = {
      houseNo: addressForm.houseNo.value,
      area: addressForm.area.value,
      street: addressForm.street.value,
      city: addressForm.city.value,
      state: addressForm.state.value,
      pincode: addressForm.pincode.value,
    };

    nextStep();

    addressFormContainer.style.display = "none";
    document.querySelector("#login-form").style.display = "block";

    console.log(addressInfo);
  });
}

export { setAddressForm, addressInfo };
