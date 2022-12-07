"use strict";

import { setDriverForm } from "./forms/driverForm.js";
import { setAddressForm } from "./forms/addressForm.js";
import { setLicenseForm } from "./forms/licenseForm.js";
import { setLoginForm } from "./forms/loginForm.js";

document.addEventListener("DOMContentLoaded", () => {
  setDriverForm();
  setAddressForm();
  setLicenseForm();
  setLoginForm();
});
