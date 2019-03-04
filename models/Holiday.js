const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const holidaySchema = new mongoose.Schema({
  key: String,
  name: String,
  date: Date,
  type: String,
  count: Number,
});

module.exports = mongoose.model('Holiday', holidaySchema);
