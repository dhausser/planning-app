const mongoose = require('mongoose');

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
      $lookup: {
        from: 'issues',
        localField: 'key',
        foreignField: 'assignee',
        as: 'issues',
      },
    },
    {
      $project: {
        _id: false,
        key: true,
        name: true,
        team: true,
        issues: true,
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

module.exports = mongoose.model('Resource', resourceSchema);
