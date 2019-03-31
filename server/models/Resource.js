import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

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

export default mongoose.model('Resource', resourceSchema);
