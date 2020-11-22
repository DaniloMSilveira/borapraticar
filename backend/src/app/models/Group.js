
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
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
  description: {
    type: String,
    require: false,
  },
  limit: {
    type: Number,
    require: false,
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


const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;

