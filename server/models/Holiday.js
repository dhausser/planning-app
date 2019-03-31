import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const holidaySchema = new mongoose.Schema({
  key: String,
  name: String,
  date: Date,
});

export default mongoose.model('Holiday', holidaySchema);
