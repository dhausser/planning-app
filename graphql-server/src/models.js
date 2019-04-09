const mongoose = require('mongoose');

const { Schema } = mongoose;

const resourceSchema = new Schema({
  key: String,
  name: String,
  team: String,
});

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

const Resource = mongoose.model('resource', resourceSchema);

module.exports = {
  Resource,
};
