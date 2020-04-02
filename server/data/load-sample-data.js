require('dotenv').config();
const { MongoClient } = require('mongodb');
// const ResourcesDAO = require('../dao/resourcesDAO');

const resources = require('./resources.json');

console.log(resources.length);

const uri = process.env.DATABASE;

const client = new MongoClient(uri, {
  poolSize: 50,
  wtimeout: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(async (err) => {
  if (err) {
    throw new Error(err);
  }

  const collection = await client
    .db('davyJSDB')
    .collection('resources')
    .find()
    .toArray();

  // collection = await client
  //   .db('davyJSDB')
  //   .collection('resources')
  //   .insertMany(resources);

  // collection = await client.db('davyJSDB').collection('resources').deleteMany();

  // await ResourcesDAO.injectDB(client);

  // ResourcesDAO.deleteManyResources();

  // console.log('Resources deleted');

  console.log(collection);
  client.close();
});

// client.connect
//   .catch((err) => {
//     console.error(err.stack);
//     process.exit(1);
//   })
//   .then(async (client) => {
//     await ResourcesDAO.injectDB(client);
//     console.log('MongoDB connected 💻,📦');
//   });
