const db = require("../db.config");
const { ctrlWrapper, errorHandling } = require("../helpers");

const addTask = async (req, res) => {
  const q =
    "INSERT INTO tasks (name, taskText, ownerId, date) values (?, ?, ?, ?)";

  const { name, taskText } = req.body;

  const { id } = req.user;

  db.query(q, [name, taskText, id, "2024-10-08"], async (err, data) => {
    if (err) return res.json(err);

    const q_new_task =
      "select t.id, t.name, t.taskText, DATE(t.date) as date, t.ownerId, u.username, u.email from tasks as t inner join users as u on u.id = t.ownerId where t.id = ? ";

    const result = await new Promise((res, rej) => {
      db.query(q_new_task, data.insertId, (err, data) => {
        if (err) return rej(err);
        return res(data);
      });
    });

    return res.json(result);
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

const deleteTask = async (req, res, next) => {
  const q =
    "DELETE t FROM tasks t INNER JOIN users u ON u.id = t.ownerId WHERE t.id = ? AND u.id = ?";

  const { taskId } = req.params;

  const { id } = req.user;

  const q_find_by_id = "select * from tasks where id = ?";

  const isIdExist = await new Promise((res, rej) => {
    db.query(q_find_by_id, [taskId], (err, data) => {
      if (err) return rej(errorHandling(404));
      if (data.length === 0) return res(false);
      return res(true);
    });
  });

  if (!isIdExist) return next(errorHandling(404, "Task not found!"));

  db.query(q, [taskId, id], (err, data) => {
    if (err) return res.json(err);
    return res.json({ message: "Deleted successfuly!" });
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
