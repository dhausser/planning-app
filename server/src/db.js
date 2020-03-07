import { MongoClient } from 'mongodb';
import ResourcesDAO from './dao/resourcesDAO';

export default new Promise((resolve, reject) => MongoClient.connect(
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
    resolve('MongoDB connection established');
  }));
