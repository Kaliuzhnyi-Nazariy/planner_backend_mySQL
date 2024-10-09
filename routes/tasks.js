const express = require("express");
const ctr = require("../controllers/tasks.js");
const { authenticate } = require("../helpers");
const validateBody = require("../helpers/validateBody.js");
const taskValidation = require("../models/Task.js");

const router = express.Router();

router.get("/", authenticate, ctr.getTasks);
router.get("/:taskId", authenticate, ctr.getOneTask);
router.post("/", authenticate, validateBody(taskValidation), ctr.addTask);
router.put(
  "/:taskId",
  authenticate,
  validateBody(taskValidation),
  ctr.updateTask
);
router.delete("/:taskId", authenticate, ctr.deleteTask);

module.exports = router;
