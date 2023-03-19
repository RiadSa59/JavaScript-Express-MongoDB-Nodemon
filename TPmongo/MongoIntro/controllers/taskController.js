const Task = require('../models/TaskSchema');

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
    const task = new Task(req.body);
  
    try {
      const savedTask = await task.save();
      res.status(201).json(savedTask);
    } catch (err) {
      if (err.code === 11000) { // Si l'erreur est due à une contrainte d'unicité
        res.status(400).json({ error: "La description de la tâche doit être unique." });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(deletedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
