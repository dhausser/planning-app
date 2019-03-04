const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const issueSchema = new mongoose.Schema({
  id: Number,
  key: String,
  summary: String,
  assignee: String,
  timeestimate: Number,
  timeoriginalestimate: Number,
  status: String,
  issuetype: String,
  aggregateprogress: Number,
});

issueSchema.statics.getAssignees = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$assignee',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'resources',
        localField: '_id',
        foreignField: 'key',
        as: 'assignee',
      },
    },
    {
      $lookup: {
        from: 'holidays',
        localField: '_id',
        foreignField: 'key',
        as: 'holidays',
      },
    },
  ]);
};

module.exports = mongoose.model('Issue', issueSchema);
