const db = require("../db.config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { errorHandling, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const q = "insert into users (username, email, password) values (?, ?, ?)";

  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(q, [username, email, hashedPassword], async (err, data) => {
    if (err) return next(errorHandling(409, "This email is already in use!"));

    const payload = {
      id: data.insertId,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    const q_insert_token = "update users set token = ? where id = ?";

    db.query(q_insert_token, [token, data.insertId], (err, data) => {
      if (err) return res.status(400).json(err);
      return res.json({
        username,
        email,
        token,
      });
    });
  });
};

const login = async (req, res, next) => {
  const q = "SELECT * from users where email = ?";
  const q_new_token = "update users set token = ? where id = ?";

  const { email, password } = req.body;

  db.query(q, email, async (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length === 0) return next(errorHandling(404));
    const comparedPassword = await bcrypt.compare(password, data[0]?.password);
    if (!comparedPassword)
      return next(errorHandling(400, "Email or password do not match!"));

    const payload = {
      id: data[0].id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    db.query(q_new_token, [token, data[0].id], (err, data) => {
      if (err) return res.status(409).json(err);
    });

    const { id, username, email } = data[0];

    return res.json({ id, username, email, token });
  });
};

const logout = (req, res) => {
  const q = "update users set token = '' where id = ?";

  const { id } = req.user;
  console.log(id);

  db.query(q, id, (err, data) => {
    console.log(q);
    if (err) return res.status(409).json(err);
    return res.json("Logged out successfuly!");
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
};
