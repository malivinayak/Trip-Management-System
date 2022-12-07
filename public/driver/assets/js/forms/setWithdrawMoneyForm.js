"use strict";

import { withdrawMoney } from "../api/withdrawMoney.js";

const setWithdrawMoneyForm = () => {
  const withdrawMoneyForm = document.querySelector("#withdrawMoneyForm");

  withdrawMoneyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = withdrawMoneyForm.amount.value;
    withdrawMoney(amount);
  });
};

export { setWithdrawMoneyForm };
