const mongoose = require('mongoose');

const timeTrackerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  totalTimeWorking: {
    type: String, 
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const timeTrackerModel = mongoose.model('timeTracker', timeTrackerSchema);

module.exports = timeTrackerModel;
