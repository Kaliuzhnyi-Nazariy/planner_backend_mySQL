const express = require("express");
const ctrl = require("../controllers/auth.js");
const { authenticate } = require("../helpers/index.js");
const validateBody = require("../helpers/validateBody.js");
const { regValidation, logValidation } = require("../models/User.js");

const router = express.Router();

router.post("/register", validateBody(regValidation), ctrl.register);
router.post("/login", validateBody(logValidation), ctrl.login);
router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
