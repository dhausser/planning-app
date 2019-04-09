const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

module.exports.createStore = () => {
  // Connect to MongoDB
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
  mongoose.connection.on(
    'error',
    console.error.bind(console, 'connection error:')
  );
  mongoose.connection.once('open', () => console.log('Connected to mongoDB!'));

  // Schema
  const { Schema } = mongoose;
  const resourceSchema = new Schema(
    {
      key: String,
      name: String,
      team: String,
    },
    {
      versionKey: false,
    }
  );
  resourceSchema.statics.getTeams = function() {
    return this.aggregate([
      {
        $group: {
          _id: '$team',
          members: { $push: '$$ROOT' },
          size: { $sum: 1 },
        },
      },
    ]);
  };
  const Resource = mongoose.model('resource', resourceSchema);

  return { resources: Resource };
};

module.exports.paginateResults = ({
  after: cursor,
  pageSize = 20,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}) => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one
    const itemCursor = item.cursor ? item.cursor : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);

  // results.slice(cursorIndex >= 0 ? cursorIndex + 1 : 0, cursorIndex >= 0);
};
