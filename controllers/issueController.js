const https = require('https');
const mongoose = require('mongoose');

const Issue = mongoose.model('Issue');

async function shallowCopy({ issues }) {
  const shallowIssues = issues.map(issue => ({
    id: issue.id || 0,
    key: issue.key || '',
    assignee: (issue.fields.assignee && issue.fields.assignee.key) || '',
    avatarUrls: (issue.fields.assignee && issue.fields.assignee.avatarUrls) || '',
    summary: issue.fields.summary || '',
    issuetype: issue.fields.issuetype.name || '',
    status: issue.fields.status.name || '',
    statusCategory: issue.fields.status.statusCategory.key || '',
    priority: issue.fields.priority.name || '',
    components: issue.fields.components || '',
  }));

  await Issue.deleteMany();

  try {
    await Issue.insertMany(shallowIssues);
  } catch (e) {
    console.log(e);
  }

  return issues;
}

function httpsPostPromise(bodyData) {
  return new Promise((resolve, reject) => {
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

    const req = https.request(options, (res) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      }
      let rawData = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(rawData);
          resolve(response);
        } catch (err) {
          console.error(err.message);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      reject();
    })

    req.write(bodyData)
    req.end();
  });
}

exports.getIssues = async (req, res) => {
  // TO DO
  // Handle query parameters
  // console.log(req.param);
  // console.log(req.query);

  if (process.env.NODE_ENV === 'production') {
    const query = 'filter=22119';
    const bodyData = `{
      "jql": "${query}",
      "startAt": 0,
      "maxResults": 500,
      "fields": [
        "summary",
        "status",
        "assignee",
        "issuetype",
        "priority",
        "components"
      ]
    }`;
    const response = await httpsPostPromise(bodyData);
    shallowCopy(response.issues);
  }

  return res.json(await Issue.find());
};