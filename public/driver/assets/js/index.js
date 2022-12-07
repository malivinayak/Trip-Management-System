import { setAcceptTripForm } from "./forms/setAcceptTripForm.js";
import { setAvailableTripsBtn } from "./forms/setAvailableTripsBtn.js";
import { getAvailableTrips } from "./api/getAvailableTrips.js";
import { setBookingHistoryBtn } from "./forms/setBookingHistoryBtn.js";
import { setTable } from "./DataTable---Fully-BSS-Editable.js";
import { setDeleteAllHistoryBtn } from "./forms/setDeleteAllHistoryBtn.js";
import { setGetBalanceBtn } from "./forms/setGetBalanceBtn.js";
import { setWithdrawMoneyForm } from "./forms/setWithdrawMoneyForm.js";

$(document).ready(() => {
  setAcceptTripForm();
  setAvailableTripsBtn();
  getAvailableTrips();
  setBookingHistoryBtn();
  setDeleteAllHistoryBtn();
  setGetBalanceBtn();
  setWithdrawMoneyForm();
  setTable(1);
  setTable(2);
});
