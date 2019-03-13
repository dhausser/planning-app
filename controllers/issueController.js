const https = require('https');
const mongoose = require('mongoose');

const Issue = mongoose.model('Issue');

exports.httpsRequest = (req, res, next) => {
  // const jql = (req.query.jql !== {}) ? req.query.jql : 'filter=22119';
  const jql = 'filter=22119';
  const bodyData = JSON.stringify({
    jql,
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

  const request = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    let rawData = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        const response = JSON.parse(rawData);
        req.issues = response.issues;
        next();
      } catch (err) {
        console.error(err.message);
      }
    });
  });
  request.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  request.write(bodyData)
  request.end();
}

exports.shallowCopy = async (req, res, next) => {
  if (req.issues) {
    console.log(`Saving ${req.issues.length} to MongoDB...`);
    const shallowIssues = req.issues.map(({ id, key, fields }) =>
      ({
        id,
        key,
        assignee: fields.assignee.key,
        summary: fields.summary,
        issuetype: fields.issuetype.name,
        status: fields.status.name,
        statusCategory: fields.status.statusCategory.key,
        priority: fields.priority.name,
        components: fields.components,
      })
    );

    await Issue.deleteMany();

    try {
      await Issue.insertMany(shallowIssues);
      console.log(`Successfully saved ${req.issues.length} to MongoDB!`);
      next();
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`Skip saving to MongoDB`);
    next();
  }
}

exports.getIssues = async (req, res, next) => {
  console.log('Returning issues from MongoDB collection')
  return res.json(await Issue.find());
}

exports.getQuery = async (req, res) => res.json(req.query.jql);