import https from 'https'

export default class AbsenceAPI {
  static getAbsences({ userId }) {
    const options = {
      method: 'GET',
      hostname: 'portal.cdprojektred.com',
      path: `/api/user_absences?apiKey=${process.env.API_KEY}&user[]=${userId}`,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }

    const req = https.request(options, res => {
      console.log('statusCode:', res.statusCode)
      console.log('headers:', res.headers)

      let rawData = ''

      res.on('data', chunk => {
        rawData += chunk
      })

      res.on('end', () => {
        const data = JSON.parse(rawData)
        res.json(data)
      })
    })

    req.on('error', e => {
      console.error(e)
    })
    req.end()
  }
}
