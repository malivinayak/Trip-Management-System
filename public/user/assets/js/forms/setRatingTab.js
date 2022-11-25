"use strict";

import { getRateableTrips } from "../api/getRateableTrips.js";
import { rateTrip } from "../api/rateTrip.js";

const setRatingTab = () => {
  const getTripForm = document.querySelector("#getTripForm");

  getTripForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getRateableTrips();
  });

  const ratingForm = document.querySelector("#ratingForm");

  ratingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      tripId: ratingForm.tripId.value,
      rating: ratingForm.rating.value,
      feedback: ratingForm.feedback.value,
    };

    rateTrip(data);
  });
};

export { setRatingTab };
