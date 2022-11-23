"use strict";

import { deleteAllHistory } from "../api/deleteAllHistory.js";

const setDeleteAllHistoryBtn = () => {
  const deleteAllBtn = document.querySelector("#deleteAll");

  deleteAllBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const confirmDelete = confirm("Are you sure you want to delete all history?");
    if (confirmDelete) {
      deleteAllHistory();
    }
  });
};

export { setDeleteAllHistoryBtn };
