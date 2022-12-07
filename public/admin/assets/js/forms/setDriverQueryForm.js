import { getQueryData } from "../api/getQueryData.js";

const setDriverQueryForm = () => {
  const driverQueryForm = document.querySelector("#driverQueryForm");

  driverQueryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const driverQueryInfo = {
      fname: driverQueryForm.fname.value,
      mname: driverQueryForm.mname.value,
      lname: driverQueryForm.lname.value,
      gender: driverQueryForm.gender.value,
      birthDateR1: driverQueryForm.birthDateR1.value,
      birthDateR2: driverQueryForm.birthDateR2.value,
      ageR1: driverQueryForm.ageR1.value,
      ageR2: driverQueryForm.ageR2.value,
      area: driverQueryForm.area.value,
      city: driverQueryForm.city.value,
      state: driverQueryForm.state.value,
      pincode: driverQueryForm.pincode.value,
      expiryDateR1: driverQueryForm.expiryDateR1.value,
      expiryDateR2: driverQueryForm.expiryDateR2.value,
      ratingR1: driverQueryForm.ratingR1.value,
      ratingR2: driverQueryForm.ratingR2.value,
      earningR1: driverQueryForm.earningR1.value,
      earningR2: driverQueryForm.earningR2.value,
    };

    getQueryData(driverQueryInfo, "driver");
  });
};

export { setDriverQueryForm };
