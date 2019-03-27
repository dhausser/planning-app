const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const holidaySchema = new mongoose.Schema({
  key: String,
  name: String,
  date: Date,
});

module.exports = mongoose.model('Holiday', holidaySchema);
