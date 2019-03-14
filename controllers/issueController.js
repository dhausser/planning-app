const https = require('https');
const mongoose = require('mongoose');

const Issue = mongoose.model('Issue');

exports.httpsRequest = (req, res, next) => {
  console.log(req.query.jql);

  const bodyData = JSON.stringify({
    jql: req.query.jql,
    startAt: 0,
    maxResults: 200,
    fields: [
      "summary",
      "status",
      "assignee",
      "issuetype",
      "priority",
      "components"
    ]
  });
  const options = {
    hostname: process.env.HOSTNAME,
    port: 443,
    path: `${process.env.API_PATH}/search`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyData),
      Accept: 'application/json',
      Authorization: process.env.AUTHORIZATION,
    },
  };

  const postRequest = https.request(options, (request) => {
    // console.log(`STATUS: ${request.statusCode}`);
    // console.log(`HEADERS: ${JSON.stringify(request.headers)}`);
    let rawData = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      rawData += chunk;
    });
    request.on('end', () => {
      try {
        const response = JSON.parse(rawData);
        req.issues = response.issues;
        console.log(req.issues.length);

        next();
      } catch (err) {
        console.error(err.message);
      }
    });
  });
  postRequest.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  postRequest.write(bodyData)
  postRequest.end();
}

exports.getFields = async (req, res) =>
  res.json(req.issues.map(({ key, fields }) =>
    ({
      key,
      summary: fields.summary,
      priority: fields.priority.name,
      status: fields.status.name,
      statusCategory: fields.status.statusCategory.key,
      issuetype: fields.issuetype.name,
      assignee: fields.assignee.key,
      displayName: fields.assignee.displayName,
    })
  ));

exports.getIssues = async (res) => res.json(await Issue.find());

exports.getQuery = async (req, res) => res.json(req.query.param);



// SAVING SHALLOW COPY TO MONGODB FOR AGGREGATION PIPELINE
//
// {
// if (req.issues) {
// await Issue.deleteMany();
// try {
// await Issue.insertMany(shallows);
// console.log(`Successfully saved ${req.issues.length} to MongoDB!`);
// next()
// } catch (e) {
// console.error(e);
// }
// } else {
// console.log(`Skip saving to MongoDB`);
// next();
// }
// }