"use strict";

import { fillTable } from "../fillTable.js";

const getRateableTrips = async () => {
  document.querySelector(".loadingContainer").classList.toggle("loading");

  // Get token from sessionStorage
  const token = sessionStorage.getItem("token");

  const arg = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  };

  try {
    const response = await fetch(`/api/trip/rateable`, arg);
    const result = await response.json();

    if (result.code === 200 && result.data) {
      fillTable(result.data, 2);
      document.getElementById("rating-form").style.display = "block";
    } else if (result.code === 500) {
      throw new Error(result.message);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong!!!\nPlease try again later!");
  }

  document.querySelector(".loadingContainer").classList.toggle("loading");
};

export { getRateableTrips };
