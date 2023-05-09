const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  executionTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Executed'],
    default: 'Open',
  },
});

module.exports = mongoose.model('Task', taskSchema);