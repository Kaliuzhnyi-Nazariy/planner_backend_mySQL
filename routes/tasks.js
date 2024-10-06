const express = require("express");
const ctr = require("../controllers/tasks.js");

const router = express.Router();

router.get("/", ctr.getTasks);
router.get("/:taskId", ctr.getOneTask);
router.post("/", ctr.addTask);
router.put("/:taskId", ctr.updateTask);
router.delete("/:taskId", ctr.deleteTask);

module.exports = router;
