"use strict";

import { setUserForm } from "./forms/userForm.js";
import { setAddressForm } from "./forms/addressForm.js";
import { setLoginForm } from "./forms/loginForm.js";

document.addEventListener("DOMContentLoaded", () => {
  setUserForm();
  setAddressForm();
  setLoginForm();
});
