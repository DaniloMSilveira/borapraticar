const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const LocationSchema = new mongoose.Schema({
  address: {
    type: String,
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
  location: {
    type: PointSchema,
    index: '2dsphere',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;