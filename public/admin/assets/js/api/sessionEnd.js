"use strict";

window.onbeforeunload = function () {
  // Get token from sessionStorage
  const token = sessionStorage.getItem("token");

  fetch("/api/session-end/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
};
