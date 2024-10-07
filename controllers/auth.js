const db = require("../db.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { SECRET_KEY } = process.env;

const userProf = ({ insertId }) => {
  const q_ret_profile = "select username, email from users where id = ?";

  return new Promise((resolve, reject) => {
    db.query(q_ret_profile, insertId, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const register = async (req, res) => {
  const q = "insert into users (username, email, password) values (?, ?, ?)";

  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(q, [username, email, hashedPassword], async (err, data) => {
    if (err) return res.status(409).json(err);

    const payload = {
      id: data.insertId,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    const q_insert_token = "update users set token = ? where id = ?";

    db.query(q_insert_token, [token, data.insertId], (err, data) => {
      if (err) return res.status(409).json(err);
      return res.json({
        username,
        email,
        token,
      });
    });
  });
};

const login = async (req, res) => {
  const q = "SELECT * from users where email = ?";
  const q_new_token = "update users set token = ? where id = ?";

  const { email, password } = req.body;

  db.query(q, email, async (err, data) => {
    if (err) return res.status(404).json(err);
    const comparedPassword = await bcrypt.compare(password, data[0].password);
    if (!comparedPassword) return new Error();

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

  // id will be received from middleware authenticate

  db.query(q, 49, (err, data) => {
    if (err) return res.status(409).json(err);
    return res.json(data);
  });
};

module.exports = { register, login, logout };
