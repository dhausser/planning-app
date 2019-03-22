const https = require('https');
const mongoose = require('mongoose');

const Issue = mongoose.model('Issue');

exports.httpsRequest = (req, res, next) => {
  req.fields = [
    'summary',
    'description',
    'status',
    'assignee',
    'issuetype',
    'priority',
  ];
  const bodyData = JSON.stringify({
    jql: req.query.jql,
    startAt: 0,
    maxResults: 500,
    fields: req.fields,
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

exports.shallowCopyToDatabase = async (req, res, next) => {
  try {
    // TODO: Assign fields via variable
    // TODO: Assign team via mapping
    const issues = req.response.issues.map(issue => {
      const {
        summary,
        description,
        priority,
        status,
        issuetype,
        assignee,
      } = issue.fields;
      return {
        key: issue.key,
        summary,
        description,
        priority: priority.name,
        status: status.name,
        statusCategory: status.statusCategory.key,
        issuetype: issuetype.name,
        assignee: assignee.key,
        displayName: assignee.displayName,
        team: 'Gameplay',
      };
    });

    // TODO: Find a better way to update and aggregate issues
    await Issue.deleteMany();
    await Issue.insertMany(issues);
    return res.json(issues);
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
  const fields = 'summary,description,status,priority,assignee';
  const options = {
    hostname: HOSTNAME,
    path: `${API_PATH}/issue/${request.query.key}?fields=${fields}`,
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
      const { summary, description, priority, status, assignee } = issue.fields;
      response.json({
        key: issue.key,
        summary,
        description,
        priority: priority.name,
        status: status.name,
        statusCategory: status.statusCategory.key,
        assignee: assignee.key,
        displayName: assignee.displayName,
        avatarUrl: assignee.avatarUrls['48x48'],
      });
    });
  });

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
};
