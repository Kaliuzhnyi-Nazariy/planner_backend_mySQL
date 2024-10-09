const { errorHandling } = require("./errorHandling");

const validateBody = (schema) => {
  const fn = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(errorHandling(400, error.message));
    }

    next();
  };

  return fn;
};

module.exports = validateBody;
