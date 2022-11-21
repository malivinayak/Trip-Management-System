import { setDriverQueryForm } from "./forms/setDriverQueryForm.js";
import { setUserQueryForm } from "./forms/setUserQueryForm.js";
import { setTable } from "./DataTable---Fully-BSS-Editable.js";

$(document).ready(() => {
  setDriverQueryForm();
  setUserQueryForm();
  setTable();
});
