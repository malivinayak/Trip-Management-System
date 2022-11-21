import { getQueryData } from "../api/getQueryData.js";

const setTripQueryForm = () => {
  const tripQueryForm = document.querySelector("#tripQueryForm");

  tripQueryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const tripQueryInfo = {
      place1: tripQueryForm.place1.value,
      place2: tripQueryForm.place2.value,
      dateTime1: tripQueryForm.dateTime1.value,
      dateTime2: tripQueryForm.dateTime2.value,
      ac: tripQueryForm.ac.value,
      fareR1: tripQueryForm.fareR1.value,
      fareR2: tripQueryForm.fareR2.value,
      userName: tripQueryForm.userName.value,
      driverName: tripQueryForm.driverName.value,
    };

    getQueryData(tripQueryInfo, "trip");
  });
};

export { setTripQueryForm };
