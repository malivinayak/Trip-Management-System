import { getQueryData } from "../api/getQueryData.js";

const setTripQueryForm = () => {
  const tripQueryForm = document.querySelector("#tripQueryForm");

  tripQueryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const tripQueryInfo = {
      place1: tripQueryForm.place1.value,
      place2: tripQueryForm.place2.value,
      startDateTime1: tripQueryForm.startDateTime1.value,
      startDateTime2: tripQueryForm.startDateTime2.value,
      endDateTime1: tripQueryForm.endDateTime1.value,
      endDateTime2: tripQueryForm.endDateTime2.value,
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
