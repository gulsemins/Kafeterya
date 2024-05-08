document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("firstname").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5555/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the parsed response data
        console.log(data);
        // Update UI or perform other actions based on the response
        if (data.error) {
          document.getElementById("message").textContent = data.error;
        } else {
          document.getElementById("message").textContent = data.message;
        }
      })
      .catch((error) => {
        // isteği göderirken hata oldunca örn int kesildi or link yanlış
        console.error("Error:", error.message);
        document.getElementById("message").textContent =
          "An error occurred. Please try again.";
      });
  });
