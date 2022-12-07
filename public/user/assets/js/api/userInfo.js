"use strict";

(async () => {
  document.querySelector("html").style.display = "none";

  // Get token from sessionStorage
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.replace("../login/");
  } else {
    // get user info
    try {
      const response = await fetch("/api/credentials/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      });
      const result = await response.json();
      if (result.code === 200) {
        document.querySelector(".user-name").innerText += result.data.userName;
      } else {
        window.location.replace("../login/");
      }
    } catch (error) {
      console.log(error);
      window.location.replace("../login/");
    }
  }
  document.querySelector("html").style.display = "block";
})();
