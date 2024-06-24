fetch("http://localhost:5555/api/myName", { credentials: "include" })
  .then((response) => {
    if (!response.ok) {
      // If response is not ok, handle the error
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => console.log(data))
  .catch((error) => {
    console.error("Error:", error);
    // Redirect to the login page
    window.location.href = "login.html";
  });
