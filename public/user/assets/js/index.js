"use strict";

import { setBookingForm } from "./forms/setBookingForm.js";
import { setBookingHistoryBtn } from "./forms/setBookingHistoryBtn.js";
import { setDeleteAllHistoryBtn } from "./forms/setDeleteAllHistoryBtn.js";
import { setGetBalanceBtn } from "./forms/setGetBalanceBtn.js";
import { setAddMoneyForm } from "./forms/setAddMoneyForm.js";
import { setRatingTab } from "./forms/setRatingTab.js";
import { setTable } from "./DataTable---Fully-BSS-Editable.js";

$(document).ready(() => {
  setBookingForm();
  setBookingHistoryBtn();
  setDeleteAllHistoryBtn();
  setGetBalanceBtn();
  setAddMoneyForm();
  setRatingTab();
  setTable();
});
