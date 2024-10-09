const JoiBase = require("joi");
const JoiDate = require("@joi/date");

const Joi = JoiBase.extend(JoiDate);

const taskValidation = Joi.object({
  name: Joi.string().min(4).required(),
  taskText: Joi.string().max(256).required(),
  date: Joi.date().format("YYYY-MM-DD").required(),
});

module.exports = taskValidation;
