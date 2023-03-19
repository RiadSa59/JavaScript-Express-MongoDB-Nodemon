const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    unique: true,
  },
  urgency: {
    type: Number,
    default: 3,
    min: 1,
    max: 5,
    set: function (value) {
      if (value < 1) {
        return 1;
      }
      if (value > 5) {
        return 5;
      }
      return value;
    },
  },
});

const Task = mongoose.model('taskBase', TaskSchema);

module.exports = Task;