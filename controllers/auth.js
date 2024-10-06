const db = require("../db.config");

const userProf = ({ insertId }) => {
  const q_ret_profile = "select username, email from users where id = ?";

  return new Promise((resolve, reject) => {
    db.query(q_ret_profile, insertId, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

const register = (req, res) => {
  const q =
    "insert into users (username, email, password, token) values (?, ?, ?, ?)";

  const { username, email, password } = req.body;

  db.query(q, [username, email, password, "token"], async (err, data) => {
    if (err) return res.status(409).json(err);
    const newUser = await userProf(data);
    return res.json(newUser);
  });
};

const login = (req, res) => {
  const q = "SELECT username, id from users where email = ? and password = ?";

  const { email, password } = req.body;

  db.query(q, [email, password], (err, data) => {
    if (err) return res.status(409).json(err);
    return res.json(data);
  });
};

const logout = (req, res) => {
  const q = "update users set token = '' where id = ?";

  db.query(q, 1, (err, data) => {
    if (err) return res.status(409).json(err);
    return res.json(data);
  });
};

module.exports = { register, login, logout };
