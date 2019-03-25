const https = require('https');
const mongoose = require('mongoose');

const Issue = mongoose.model('Issue');

exports.getIssues = async (req, res) => res.json(await Issue.find());

exports.searchIssues = (request, response, next) => {
  console.log(request.body);
  const bodyData = JSON.stringify(request.body);

  const options = {
    hostname: process.env.HOSTNAME,
    port: 443,
    path: '/search',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyData),
      Accept: 'application/json',
      Authorization: process.env.AUTHORIZATION,
    },
  };

  console.log(options);

  const req = https.request(options, res => {
    let rawData = '';
    res.setEncoding('utf8');
    res.on('data', chunk => {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        request.response = JSON.parse(rawData);
        next();
      } catch (err) {
        console.error(err.message);
      }
    });
  });

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });

  req.write(bodyData);
  req.end();
};

exports.shallowCopyIssues = async (req, res, next) => {
  await Issue.deleteMany();

  const issues = req.response.issues.map(issue => ({
    key: issue.key,
    summary: issue.fields.summary,
    description: issue.fields.description,
    priority: issue.fields.priority.name,
    status: issue.fields.status.name,
    statusCategory: issue.fields.status.statusCategory.key,
    issuetype: issue.fields.issuetype.name,
    assignee: issue.fields.assignee.key,
    displayName: issue.fields.assignee.displayName,
    creatorKey: issue.fields.creator.key,
    creatorName: issue.fields.creator.displayName,
    fixVersion: issue.fields.fixVersions[0].name,
    subtasks: issue.fieds.subtasks,
  }));

  try {
    await Issue.insertMany(issues);
    return res.json(issues);
  } catch (e) {
    console.log(e);
  }
};

exports.editIssue = (request, response) => {
  // const bodyData = JSON.stringify({
  //   update: { summary: [{ set: request.body.summary }] },
  // });
  const bodyData = JSON.stringify({
    fields: { summary: request.body.summary },
  });

  const options = {
    hostname: process.env.HOSTNAME,
    port: 443,
    path: `/issue/${request.body.key}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyData),
      Accept: 'application/json',
      Authorization: process.env.AUTHORIZATION,
    },
  };

  const req = https.request(options, res => response.json(request.statusCode));

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });

  req.write(bodyData);
  req.end();
};

exports.getIssue = (request, response, next) => {
  const fields =
    'summary,description,status,priority,assignee,creator,fixVersions,issuetype';
  const options = {
    hostname: process.env.HOSTNAME,
    path: `/issue/${request.query.key}?fields=${fields}`,
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
      request.issue = {
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description,
        priority: issue.fields.priority.name,
        status: issue.fields.status.name,
        statusCategory: issue.fields.status.statusCategory.key,
        assignee: issue.fields.assignee.key,
        displayName: issue.fields.assignee.displayName,
        avatarUrl: issue.fields.assignee.avatarUrls['48x48'],
        creator: issue.fields.creator.displayName,
        fixVersion: issue.fields.fixVersions[0].name,
        issuetype: issue.fields.issuetype.name,
      };
      next();
    });
  });

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
};

exports.getComments = (request, response) => {
  const options = {
    hostname: process.env.HOSTNAME,
    path: `/issue/${request.query.key}/comment`,
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
      const { comments } = JSON.parse(rawData);
      response.json({
        issue: request.issue,
        comments,
      });
    });
  });

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
};
