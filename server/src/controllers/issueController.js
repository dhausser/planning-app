import https from 'https'

export default class IssueAPI {
  static searchIssues(request, response) {
    const { options, bodyData } = request.body
    const req = https.request(options, res => {
      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      let rawData = ''
      res.setEncoding('utf8')
      res.on('data', chunk => {
        rawData += chunk
      })
      res.on('end', () => {
        try {
          response.json(JSON.parse(rawData))
        } catch (err) {
          console.error(err.message)
        }
      })
    })

    req.on('error', e => {
      console.error(`problem with request: ${e.message}`)
    })

    req.write(JSON.stringify(bodyData))
    req.end()
  }

  static editIssue(request, response) {
    const bodyData = JSON.stringify({
      fields: { summary: request.body.summary },
    })
    const options = {
      hostname: process.env.HOST,
      port: 443,
      path: `/${process.env.API_PATH}/issue/${request.body.key}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyData),
        Accept: 'application/json',
        Authorization: process.env.AUTHORIZATION,
      },
    }

    const req = https.request(options, res => response.json(request.statusCode))

    req.on('error', e => {
      console.error(`problem with request: ${e.message}`)
    })

    req.write(bodyData)
    req.end()
  }

  static getIssue(request, response, next) {
    const fields =
      'summary,description,status,priority,assignee,creator,fixVersions,issuetype,comment'
    const options = {
      hostname: process.env.HOST,
      path: `/${process.env.API_PATH}/issue/${
        request.query.key
      }?fields=${fields}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: process.env.AUTHORIZATION,
      },
    }

    const req = https.request(options, res => {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', chunk => {
        rawData += chunk
      })
      res.on('end', () => {
        const issue = JSON.parse(rawData)
        request.issue = issue
        next()
      })
    })

    req.on('error', e => {
      console.error(`problem with request: ${e.message}`)
    })

    req.end()
  }

  static getComments(request, response) {
    const options = {
      hostname: process.env.HOST,
      path: `/${process.env.API_PATH}/issue/${request.query.key}/comment`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: process.env.AUTHORIZATION,
      },
    }

    const req = https.request(options, res => {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', chunk => {
        rawData += chunk
      })

      res.on('end', () => {
        const { comments } = JSON.parse(rawData)
        response.json({
          issue: request.issue,
          comments,
        })
      })
    })

    req.on('error', e => {
      console.error(`problem with request: ${e.message}`)
    })

    req.end()
  }

  static getFixVersions(request, response) {
    const options = {
      method: 'GET',
      hostname: process.env.HOST,
      path: `${process.env.API_PATH}${request.body.resource}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: request.body.Authorization,
      },
    }

    const req = https.request(options, res => {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', chunk => {
        rawData += chunk
      })

      res.on('end', () => {
        const data = JSON.parse(rawData)
        response.json(data)
      })
    })

    req.on('error', e => {
      console.error(`problem with request: ${e.message}`)
    })

    req.end()
  }
}
