require('dotenv').config();
const fs = require('fs');
const { MongoClient } = require('mongodb');
const csvtojson = require('csvtojson');
const resources = require('./resources.json');

const inputFilePath = './data/resources.csv';
const outputFilePath = './data/resources.json';
const uri = process.env.DATABASE;

const client = new MongoClient(uri, {
  poolSize: 50,
  wtimeout: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function writeDataToFile(data) {
  const result = JSON.stringify(data);
  fs.writeFileSync(outputFilePath, result);
}

async function getDataFromFile() {
  const data = await csvtojson().fromFile(inputFilePath);
  return data;
}

async function deleteData() {
  client.connect(async () => {
    console.log('😢😢 Goodbye Data...');
    await client.db('davyJSDB').collection('resources').deleteMany({});
    console.log(
      'Data Deleted. To load sample data, run\n\n\t npm run sample\n\n',
    );
    client.close();
    process.exit();
  });
}

async function loadData() {
  client.connect(async (err) => {
    if (err) {
      console.log(
        '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n',
      );
      console.log(err);
    }

    if (!resources) {
      const data = await getDataFromFile();
      writeDataToFile(data);
    }

    await client.db('davyJSDB').collection('resources').insertMany(resources);

    console.log('👍👍👍👍👍👍👍👍 Done!');

    client.close();
    process.exit();
  });
}

if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
