import { RESTDataSource } from 'apollo-datasource-rest'

export default class AbsenceAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.PORTAL_URL
  }

  willSendRequest(request) {
    request.params.set('apiKey', this.context.portalToken)
  }

  async getAllAbsences() {
    const response = await this.get()
    return Array.isArray(response) ? response : []
  }

  async getAbsencesById({ userId }) {
    const response = await this.get(`?user[]=${userId}`)
    return response
  }
}
