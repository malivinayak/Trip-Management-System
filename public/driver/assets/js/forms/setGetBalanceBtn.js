"use strict";

import { getWalletBalance } from "../api/getWalletBalance.js";

const setGetBalanceBtn = () => {
  const walletForm = document.querySelector("#walletForm");

  walletForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getWalletBalance();
  });
};

export { setGetBalanceBtn };
