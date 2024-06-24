document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // bunu eklemezsek form default olarak şifremizi vs gösteriyor
    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    try {
      const response = await fetch("http://localhost:5555/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  });
