const { errorHandling } = require("./errorHandling");
const jwt = require("jsonwebtoken");
const db = require("../db.config");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) {
    next(401, "Unauthorized");
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const q = "SELECT id, username, email from users where id = ?";
    const user = await new Promise((resolve, reject) => {
      db.query(q, id, (err, data) => {
        if (err) return reject(errorHandling(500, "Something went wrong!"));

        if (data.length === 0) return reject(errorHandling(404));

        return resolve(data[0]);
      });
    });

    if (!user) return errorHandling(404);

    req.user = user;
    next();
  } catch (error) {
    next(errorHandling(401, "Unauthorized 36"));
  }
};

module.exports = { authenticate };
