
const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    require: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    require: true,
  },
  date: {
    type: Date,
    require: true
  },
  hourIni: {
    type: Number,
    require: true
  },
  hourFim: {
    type: Number,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: true
});


const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;

