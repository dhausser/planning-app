const https = require('https');
const mongoose = require('mongoose');

const Issue = mongoose.model('Issue');

async function saveIssues(rawIssues) {
  function parseIssue(issue) {
    return {
      id: issue.id || 0,
      key: issue.key || '',
      assignee: (issue.fields.assignee && issue.fields.assignee.key) || '',
      summary: issue.fields.summary || '',
      status: issue.fields.status.name || '',
      issuetype: issue.fields.issuetype.name || '',
    };
  }

  const issues = rawIssues.map(issue => parseIssue(issue));

  await Issue.deleteMany();

  try {
    await Issue.insertMany(issues);
  } catch (e) {
    console.log(e);
  }

  return issues;
}

function httpsPostPromise(jql) {
  return new Promise((resolve, reject) => {
    const bodyData = `{
      "jql": "${jql}",
      "startAt": 0,
      "maxResults": 500,
      "fields": [
        "summary",
        "status",
        "assignee",
        "issuetype"
      ]
    }`;

    const options = {
      hostname: process.env.HOST,
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

    const req = https.request(options, res => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      }
      let rawData = '';
      res.setEncoding('utf8');
      res.on('data', chunk => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(rawData);
          const { issues } = response;
          resolve(saveIssues(issues));
        } catch (err) {
          console.error(err.message);
        }
      });
    });

    req.on('error', e => {
      console.error(`problem with request: ${e.message}`);
      reject();
    });

    // write data to request body
    req.write(bodyData);
    req.end();
  });
}

exports.getIssues = async (req, res) => res.json(await Issue.find());

// exports.getIssues = async (req, res) => {
//   const jql = 'filter=22119';
//   httpsPostPromise(jql);
//   return res.json(await Issue.find());
// };
