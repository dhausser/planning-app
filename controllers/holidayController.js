const mongoose = require('mongoose');
const Holiday = mongoose.model('Holiday');

exports.getHolidays = async (req, res) => res.json(await Holiday.find());
