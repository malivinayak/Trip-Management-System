import { setTable } from "./DataTable---Fully-BSS-Editable.js";

const fillTable = (data, tableNo) => {
  $(`#mydatatable${tableNo}`).DataTable().destroy();

  document.getElementById(`dataTable${tableNo}`).style.display = "block";
  const myTable = document.getElementById(`mydatatable${tableNo}`);

  const myTableHead = myTable.getElementsByTagName("thead")[0];
  const myTableBody = myTable.getElementsByTagName("tbody")[0];

  if (data.properties.length > 0) {
    let tableHead = "<tr>";
    data.properties.forEach((property) => {
      tableHead += `<th>${property}</th>`;
    });
    tableHead += "</tr>";
    myTableHead.innerHTML = tableHead;

    let tableBody = "";
    data.values.forEach((value) => {
      tableBody += "<tr>";
      data.properties.forEach((property) => {
        tableBody += `<td>${value[property]}</td>`;
      });
      tableBody += "</tr>";
    });
    myTableBody.innerHTML = tableBody;
  } else {
    myTableHead.innerHTML = "<tr><th>No data</th></tr>";
    myTableBody.innerHTML = "<tr><td>No data</td></tr>";
  }

  setTable(tableNo);
  myTable.focus();
};

export { fillTable };
