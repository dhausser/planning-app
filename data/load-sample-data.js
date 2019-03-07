require('dotenv').config({ path: `${__dirname}/../.env` });
const fs = require('fs');

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const Resource = require('../models/Resource');
const Holiday = require('../models/Holiday');
const Issue = require('../models/Issue');

const resources = JSON.parse(
  fs.readFileSync(`${__dirname}/resources.json`, 'utf-8'),
);
const holidays = JSON.parse(
  fs.readFileSync(`${__dirname}/holidays.json`, 'utf-8'),
);
const issues = JSON.parse(
  fs.readFileSync(`${__dirname}/issues.json`, 'utf-8'),
);

async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  await Resource.deleteMany();
  await Holiday.deleteMany();
  await Issue.deleteMany();
  console.log(
    'Data Deleted. To load sample data, run\n\n\t npm run sample\n\n',
  );
  process.exit();
}

async function loadData() { 
  try {
    await Resource.insertMany(resources);
    await Holiday.insertMany(holidays);
    await Issue.insertMany(issues);
    console.log('👍👍👍👍👍👍👍👍 Done!');
    process.exit();
  } catch (e) {
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n',
    );
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
