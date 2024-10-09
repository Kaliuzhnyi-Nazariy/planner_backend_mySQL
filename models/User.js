const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const regValidation = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .required(),
});

const logValidation = Joi.object({
  email: Joi.string().email().required(),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .required(),
});

module.exports = { regValidation, logValidation };
