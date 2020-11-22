
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  avatar: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    require: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  hourIni: {
    type: Number,
    require: true,
  },
  hourFim: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
  limit: {
    type: Number,
    require: true,
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


const Event = mongoose.model('Event', EventSchema);

module.exports = Event;

