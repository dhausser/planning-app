import { RESTDataSource } from 'apollo-datasource-rest'

export default class AbsenceAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.PORTAL_URL
  }

  willSendRequest(request) {
    request.params.set('apiKey', process.env.PORTAL_API_KEY)
  }

  async getAllAbsences() {
    const response = await this.get()
    return Array.isArray(response) ? response : []
  }

  async getAbsencesById({ userId }) {
    console.log(userId)
    const response = await this.get(`?user[]=${userId}`)
    console.log(response)
    return response
  }
}