
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  name: {
      type: String,
      require: true,
  },
  image: {
      type: String,
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


const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;

