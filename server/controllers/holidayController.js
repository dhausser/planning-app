const mongoose = require('mongoose');

const Holiday = mongoose.model('Holiday');

exports.getHolidays = async (request, response) =>
  response.json(await Holiday.find());
