const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

module.exports.createStore = () => {
  mongoose.connect(process.env.DATABASE, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  });
  mongoose.Promise = global.Promise;
  mongoose.connection.on('error', err => {
    console.error(err.message);
  });

  const resourceSchema = new mongoose.Schema(
    {
      key: String,
      name: String,
      team: String,
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  resourceSchema.statics.getResources = function() {
    return this.aggregate([
      {
        $lookup: {
          from: 'holidays',
          localField: 'key',
          foreignField: 'key',
          as: 'holidays',
        },
      },
      {
        $project: {
          _id: false,
          key: true,
          name: true,
          team: true,
          holidays: true,
        },
      },
    ]);
  };

  resourceSchema.statics.getTeams = function() {
    return this.aggregate([
      {
        $group: {
          _id: '$team',
          size: { $sum: 1 },
        },
      },
    ]);
  };

  return { resourceSchema };
};
