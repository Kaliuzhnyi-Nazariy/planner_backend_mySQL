const db = require("../db.config");

const addTask = (req, res) => {
  const q =
    "INSERT INTO tasks (name, taskText, ownerId, date) values (?, ?, ?, ?)";

  db.query(
    q,
    [req.body.name, req.body.taskText, 2, "2024-10-08"],
    (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    }
  );
};

const getTasks = (req, res) => {
  const q =
    "select t.id, t.name, t.taskText, DATE(t.date), t.ownerId, u.username, u.email from tasks as t inner join users as u on u.id = t.ownerId where u.id = ?";

  db.query(q, 1, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const getOneTask = (req, res) => {
  const q =
    "select t.id, t.name, t.taskText, DATE(t.date), u.username, u.email from tasks as t inner join users as u on u.id = t.ownerId where u.id = ? and t.id = ?";

  const { taskId } = req.params;

  db.query(q, [1, taskId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const deleteTask = (req, res) => {
  const q =
    "DELETE t FROM tasks t INNER JOIN users u ON u.id = t.ownerId WHERE t.id = ? AND u.id = ?";

  const { taskId } = req.params;

  db.query(q, [taskId, 1], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const updateTask = (req, res) => {
  const q =
    "update tasks t inner join users u on u.id = t.ownerId set t.name = ?, t.taskText = ?, t.date = ?  where t.id = ? and u.id = ?";

  const { taskId } = req.params;

  db.query(
    q,
    [req.body.name, req.body.taskText, req.body.date, taskId, 1],
    (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    }
  );
};

module.exports = {
  addTask,
  getTasks,
  getOneTask,
  deleteTask,
  updateTask,
};
