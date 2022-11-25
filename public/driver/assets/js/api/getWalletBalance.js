"use strict";

const getWalletBalance = async () => {
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
    const response = await fetch(`/api/cbs/get-balance/driver`, arg);
    const result = await response.json();

    if (result.code === 200 && result.data) {
      document.getElementById("walletBalance").textContent = `Wallet Balance: ₹${result.data.balance}`;
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

export { getWalletBalance };
