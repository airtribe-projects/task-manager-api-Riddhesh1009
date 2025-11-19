const { v4: uuidv4 } = require("uuid");
const loadTasks = require("../task.json");
let tasks = loadTasks.tasks || [];

function listAll() {
  return tasks;
}

function findById(id) {
  return tasks.find((t) => t.id == id) || null;
}

function create(task) {
  const newTask = {
    id: uuidv4(),
    title: task.title,
    description: task.description,
    completed: task.completed,
    priority: task.priority || "low",
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  return newTask;
}

function update(id, updates) {
  const t = findById(id);
  if (!t) return null;
  Object.assign(t, updates);
  return t;
}

function remove(id) {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id != id);
  return tasks.length !== before;
}

module.exports = {
  listAll,
  findById,
  create,
  update,
  remove,
};
