const https = require('https');

exports.getAbsences = async (request, response) => {
  const options = {
    method: 'GET',
    hostname: 'portal.cdprojektred.com',
    path: `/api/user_absences?apiKey=${process.env.API_KEY}&user[]=${
      request.query.user
    }`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
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
