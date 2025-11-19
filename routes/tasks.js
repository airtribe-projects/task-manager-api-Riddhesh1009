const express = require("express");
const router = express.Router();
const store = require("../data/tasksStore");

function validateTaskInput(body) {
  const errors = [];

    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      errors.push({
        field: "title",
        message: "Title is required and must be a non-empty string",
      });
    }
    if (typeof body.description !== "string"|| body.description.trim().length === 0) {
      errors.push({
        field: "description",
        message: "Description must be a non-empty string",
      });
    }

    if (typeof body.completed !== "boolean") {
      errors.push({
        field: "completed",
        message: "Completed must be a boolean",
      });
    }

  return errors;
}

/**
 * GET /tasks
 * Query params:
 *  - completed (true|false)  — filter by completion status
*/
router.get("/", (req, res, next) => {
  try {
    let tasks = store.listAll();

    // Filtering
    if (req.query.completed) {
      tasks = tasks.filter((t) => t.completed === (req.query.completed === 'true'));
    }
    // Default sort: createdAt ASC
    // tasks = tasks.slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /tasks/priority/:level
 * Retrieve tasks by priority: low | medium | high
 */
router.get('/priority/:level', (req, res, next) => {
  try {
    const { level } = req.params;
    const valid = ['low', 'medium', 'high'];

    if (!valid.includes(level)) {
      return res.status(400).json({
        error: "ValidationError",
        message: `Priority must be one of: ${valid.join(', ')}`
      });
    }

    const tasks = store.listAll().filter(t => t.priority === level);
    res.json({ total: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /tasks/:id
 */
router.get("/:id", (req, res, next) => {
  try {
    const t = store.findById(req.params.id);
    if (!t)
      return res
        .status(404)
        .json({ error: "NotFound", message: "Task not found" });
    res.json(t);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /tasks
*/
router.post("/", (req, res, next) => {
  try {
    const errors = validateTaskInput(req.body);
    if (errors.length) {
      const err = new Error("Validation failed");
      err.status = 400;
      err.details = errors;
      throw err;
    }

    const newTask = store.create(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /tasks/:id  — replace task (all required except can keep description empty)
 */
router.put("/:id", (req, res, next) => {
  try {
    const existing = store.findById(req.params.id);
    if (!existing)
      return res
        .status(404)
        .json({ error: "NotFound", message: "Task not found" });

    const errors = validateTaskInput(req.body);
    if (errors.length) {
      const err = new Error("Validation failed");
      err.status = 400;
      err.details = errors;
      throw err;
    }

    const updated = store.update(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /tasks/:id
 */
router.delete("/:id", (req, res, next) => {
  try {
    const ok = store.remove(req.params.id);
    if (!ok)
      return res
        .status(404)
        .json({ error: "NotFound", message: "Task not found" });
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
