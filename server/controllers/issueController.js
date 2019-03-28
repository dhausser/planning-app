const https = require('https');

exports.searchIssues = (request, response, next) => {
  const bodyData = JSON.stringify(request.body);
  console.log(bodyData);

  const options = {
    hostname: process.env.HOSTNAME,
    port: 443,
    path: `/${process.env.API_PATH}/search`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyData),
      Accept: 'application/json',
      Authorization: process.env.AUTHORIZATION,
    },
  };

  const req = https.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    let rawData = '';
    res.setEncoding('utf8');
    res.on('data', chunk => {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        const data = JSON.parse(rawData);
        response.json(data);
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
    path: `/${process.env.API_PATH}/issue/${request.body.key}`,
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
    path: `/${process.env.API_PATH}/issue/${
      request.query.key
    }?fields=${fields}`,
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
      request.issue = issue;
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
    path: `/${process.env.API_PATH}/issue/${request.query.key}/comment`,
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

exports.getFixVersions = (request, response) => {
  const options = {
    method: 'GET',
    hostname: process.env.HOSTNAME,
    path: `/${
      process.env.API_PATH
    }/project/${10500}/version?startAt=59&maxResults=5&orderBy=+releaseDate&status=unreleased`,
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
      const data = JSON.parse(rawData);
      response.json(data);
    });
  });

  req.on('error', e => {
    console.error(`problem with request: ${e.message}`);
  });

  req.end();
};
