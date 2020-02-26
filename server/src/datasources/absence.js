import { RESTDataSource } from "apollo-datasource-rest"

class AbsenceAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = "https://portal.cdprojektred.com/api/user_absences"
    this.apiKey = process.env.PORTAL_API_KEY
  }

  async getAllAbsences() {
    const response = await this.get("", { apiKey: this.apiKey })
    return Array.isArray(response) ? response : []
  }

  async getAbsencesById({ userId }) {
    return this.get(`?user[]=${userId}`, { apiKey: this.apiKey })
  }
}

export default AbsenceAPI
