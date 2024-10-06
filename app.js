require("dotenv").config();

const express = require("express");
const cors = require("cors");
// const moment = require("moment");
const app = express();

const usersRoutes = require("./routes/users");
const tasksRoutes = require("./routes/tasks");

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/tasks", tasksRoutes);

app.get("/", (req, res) => {
  res.json("tasks");
});

module.exports = app;
