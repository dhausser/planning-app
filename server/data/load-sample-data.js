require('dotenv').config();
const fs = require('fs');
const { MongoClient } = require('mongodb');
const csvtojson = require('csvtojson');

const inputFilePath = './data/resources.csv';
const outputFilePath = './data/resources.json';
const uri = process.env.DATABASE;

const client = new MongoClient(uri, {
  poolSize: 50,
  wtimeout: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function writeDataToFile(resources) {
  const data = JSON.stringify(resources);
  fs.writeFileSync(outputFilePath, data);
}

async function getDataFromFile() {
  const resources = await csvtojson().fromFile(inputFilePath);
  writeDataToFile(resources);
  return resources;
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

    const resources = getDataFromFile();

    await client.db('davyJSDB').collection('resources').insertMany(resources);

    console.log('👍👍👍👍👍👍👍👍 Done!');

    client.close();
    process.exit();
  });
}

if (process.argv.includes('--delete')) {
  console.log('Deletind data...');
  deleteData();
} else {
  console.log('Loading data...');
  loadData();
}
