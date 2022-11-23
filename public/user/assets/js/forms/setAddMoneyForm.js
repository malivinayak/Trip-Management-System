"use strict";

import { addMoney } from "../api/addMoney.js";

const setAddMoneyForm = () => {
  const addMoneyForm = document.querySelector("#addMoneyForm");

  addMoneyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = addMoneyForm.amount.value;
    addMoney(amount);
  });
};

export { setAddMoneyForm };
