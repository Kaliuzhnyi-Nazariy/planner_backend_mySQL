const express = require("express");
const ctrl = require("../controllers/auth.js");

const router = express.Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);

module.exports = router;
