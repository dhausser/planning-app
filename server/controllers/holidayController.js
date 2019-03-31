import mongoose from 'mongoose';

const Holiday = mongoose.model('Holiday');

export async function getHolidays(req, res) {
  return res.json(await Holiday.find());
}
