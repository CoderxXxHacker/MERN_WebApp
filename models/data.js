// models/data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
