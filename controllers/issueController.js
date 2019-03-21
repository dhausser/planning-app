const https = require('https');
const querystring = require('querystring');
const mongoose = require('mongoose');

const Issue = mongoose.model('Issue');

function getFields(issue) {
  return {
    key: issue.key,
    summary: issue.fields.summary,
    description: issue.fields.description,
    priority: issue.fields.priority.name,
    status: issue.fields.status.name,
    statusCategory: issue.fields.status.statusCategory.key,
    issuetype: issue.fields.issuetype.name,
    assignee: issue.fields.assignee.key,
    displayName: issue.fields.assignee.displayName,
  };
}

exports.httpsRequest = (req, res, next) => {
  const bodyData = JSON.stringify({
    jql: req.query.jql,
    startAt: 0,
    maxResults: 500,
    fields: [
      'summary',
      'description',
      'status',
      'assignee',
      'issuetype',
      'priority',
    ],
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

  const postRequest = https.request(options, request => {
    let rawData = '';
    request.setEncoding('utf8');
    request.on('data', chunk => {
      rawData += chunk;
    });
    request.on('end', () => {
      try {
        const response = JSON.parse(rawData);
        req.response = response;
        next();
      } catch (err) {
        console.error(err.message);
      }
    });
  });
  postRequest.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });
  postRequest.write(bodyData);
  postRequest.end();
};

exports.getFields = async (req, res) => {
  try {
    if (req.response.issues) {
      const issues = req.response.issues.map(issue => getFields(issue));

      // TODO: Find a better way to update and aggregate issues
      await Issue.deleteMany();
      await Issue.insertMany(issues);

      return res.json(issues);
    }
    return res.json(getFields(req.response));
  } catch (e) {
    console.log(e);
  }
};

exports.getIssues = async (req, res) => res.json(await Issue.find());

exports.editIssue = async (req, res) => {
  const bodyData = JSON.stringify({
    update: { summary: [{ set: `${req.body.summary}` }] },
  });
  // const bodyData = JSON.stringify({ "fields": { "summary": `${req.body.summary}` } });

  const options = {
    hostname: process.env.HOSTNAME,
    port: 443,
    path: `${process.env.API_PATH}/issue/${req.body.key}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyData),
      Accept: 'application/json',
      Authorization: process.env.AUTHORIZATION,
    },
  };

  const postRequest = https.request(options, request =>
    res.json(request.statusCode)
  );
  postRequest.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });
  postRequest.write(bodyData);
  postRequest.end();
};

exports.getIssue = async (request, response) => {
  const { HOSTNAME, API_PATH } = process.env;

  const options = {
    hostname: HOSTNAME,
    path: `${API_PATH}/issue/${request.query.key}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: process.env.AUTHORIZATION,
    },
  };

  const req = https.request(options, res => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', chunk => {
      rawData += chunk;
    });
    res.on('end', () => {
      const issue = JSON.parse(rawData);
      const { summary, description, priority, status } = issue.fields;
      response.json({
        key: issue.key,
        summary,
        description,
        priority: priority.name,
        status: status.name,
      });
    });
  });

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
};
