const errorMessages = {
  400: "bad requests",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
};

const errorHandling = (code, message = errorMessages[code]) => {
  const error = new Error(message);
  error.status = code;
  return error;
};

module.exports = {
  errorHandling,
};
