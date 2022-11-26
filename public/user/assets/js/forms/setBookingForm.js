"use strict";

import { bookTrip } from "../api/bookTrip.js";

const setBookingForm = () => {
  const bookingForm = document.querySelector("#bookingForm");

  // Set booking form min date-time to 30mins from now
  const today = new Date(new Date().getTime() + 30 * 60 * 1000);
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const ThirtyMinsLater = `${yyyy}-${mm}-${dd}T${today.getHours()}:${today.getMinutes()}`;
  bookingForm
    .querySelector("input[name='startTime']")
    .setAttribute("min", ThirtyMinsLater);

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const bookingInfo = {
      startPlace: bookingForm.startPlace.value,
      endPlace: bookingForm.endPlace.value,
      startTime: bookingForm.startTime.value,
      ac: bookingForm.ac.value,
      vehicleType: bookingForm.vehicleType.value,
    };

    const confirmation = confirm(`
Are you sure you want to book a trip for:

Start Place: ${bookingInfo.startPlace}
Destination: ${bookingInfo.endPlace}
Start Time: ${bookingInfo.startTime.replace("T", " ")}
Vehicle Type: ${bookingInfo.vehicleType === "0" ? "Private" : "Taxi"}
AC: ${bookingInfo.ac === "1" ? "Yes" : "No"}

Cost per KM: ₹${(bookingInfo.vehicleType === "0" ? 30 : 20) + (bookingInfo.ac === "1" ? 10 : 0)}
`);

    if (!confirmation) return;

    bookTrip(bookingInfo);
  });
};

export { setBookingForm };
