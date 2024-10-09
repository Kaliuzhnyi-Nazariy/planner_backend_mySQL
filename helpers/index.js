const { errorHandling } = require("./errorHandling");
const { authenticate } = require("./authenticate");
const { ctrlWrapper } = require("./ctrlWrapper");
const { validateBody } = require("./validateBody");

module.exports = {
  errorHandling,
  authenticate,
  ctrlWrapper,
  validateBody,
};
