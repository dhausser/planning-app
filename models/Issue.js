const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const issueSchema = new mongoose.Schema({
  id: Number,
  key: String,
  summary: String,
  description: String,
  assignee: String,
  displayName: String,
  status: String,
  issuetype: String,
  priority: String,
  statusCategory: String,
  creatorKey: String,
  creatorName: String,
  fixVersion: String,
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
    {
      $project: {
        _id: false,
        id: false,
        key: true,
        summary: true,
        issuetype: true,
        status: true,
        priority: true,
        statusCategory: true,
        components: true,
      },
    },
  ]);
};

module.exports = mongoose.model('Issue', issueSchema);
