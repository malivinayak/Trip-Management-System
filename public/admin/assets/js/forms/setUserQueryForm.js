import { getQueryData } from "../api/getQueryData.js";

const setUserQueryForm = () => {
  const userQueryForm = document.querySelector("#userQueryForm");

  userQueryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userQueryInfo = {
      fname: userQueryForm.fname.value,
      mname: userQueryForm.mname.value,
      lname: userQueryForm.lname.value,
      gender: userQueryForm.gender.value,
      birthDateR1: userQueryForm.birthDateR1.value,
      birthDateR2: userQueryForm.birthDateR2.value,
      ageR1: userQueryForm.ageR1.value,
      ageR2: userQueryForm.ageR2.value,
      area: userQueryForm.area.value,
      city: userQueryForm.city.value,
      state: userQueryForm.state.value,
      pincode: userQueryForm.pincode.value,
    };

    getQueryData(userQueryInfo, "user");
  });
};

export { setUserQueryForm };
