window.onbeforeunload = function () {
  // Get token from sessionStorage
  const token = sessionStorage.getItem("token");
  sessionStorage.removeItem("token");

  fetch("/api/session-end/driver", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  });
};
