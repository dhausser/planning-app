const { MongoClient } = require('mongodb');
const ResourcesDAO = require('./dao/resourcesDAO');

module.exports = new Promise((resolve, reject) => MongoClient.connect(
  process.env.ROADMAP_DB_URI,
  {
    poolSize: 50,
    wtimeout: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .catch((err) => {
    reject(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ResourcesDAO.injectDB(client);
    console.log('MongoDB connection established');
    resolve();
  }));
