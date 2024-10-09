const db = require("../db.config");
const { ctrlWrapper } = require("../helpers");

const addTask = (req, res) => {
  const q =
    "INSERT INTO tasks (name, taskText, ownerId, date) values (?, ?, ?, ?)";

  const { name, taskText } = req.body;

  const { id } = req.user;

  db.query(q, [name, taskText, id, "2024-10-08"], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const getTasks = (req, res) => {
  const q =
    "select t.id, t.name, t.taskText, DATE(t.date), t.ownerId, u.username, u.email from tasks as t inner join users as u on u.id = t.ownerId where u.id = ?";

  const { id } = req.user;

  db.query(q, id, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const getOneTask = (req, res) => {
  const q =
    "select t.id, t.name, t.taskText, DATE(t.date), u.username, u.email from tasks as t inner join users as u on u.id = t.ownerId where u.id = ? and t.id = ?";

  const { taskId } = req.params;

  const { id } = req.user;

  db.query(q, [id, taskId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const deleteTask = (req, res) => {
  const q =
    "DELETE t FROM tasks t INNER JOIN users u ON u.id = t.ownerId WHERE t.id = ? AND u.id = ?";

  const { taskId } = req.params;

  const { id } = req.user;

  db.query(q, [taskId, id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const updateTask = (req, res) => {
  const q =
    "update tasks t inner join users u on u.id = t.ownerId set t.name = ?, t.taskText = ?, t.date = ?  where t.id = ? and u.id = ?";

  const q_updatedTask =
    "Select * from tasks t inner join users u on u.id = t.ownerId where t.id = ? and u.id = ? ";

  const { taskId } = req.params;
  const { id } = req.user;

  const { name, taskText, date } = req.body;

  db.query(q, [name, taskText, date, taskId, id], async (err, data) => {
    if (err) return res.json(err);
    const newTask = await new Promise((resolve, reject) => {
      db.query(q_updatedTask, [taskId, id], (err, data) => {
        if (err) return reject(err);
        const { id, name, taskText, ownerId, date, username } = data[0];
        return resolve({ id, name, taskText, date, ownerId, username });
      });
    });
    return res.json(newTask);
  });
};

module.exports = {
  addTask: ctrlWrapper(addTask),
  getTasks: ctrlWrapper(getTasks),
  getOneTask: ctrlWrapper(getOneTask),
  deleteTask: ctrlWrapper(deleteTask),
  updateTask: ctrlWrapper(updateTask),
};
