require("dotenv").config();
const app = require("./app");

app.listen(3018, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log("Server running on port 3018");
  }
});
