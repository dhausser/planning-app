import { RESTDataSource } from 'apollo-datasource-rest';

class AbsenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PORTAL_URL;
    this.apiKey = process.env.PORTAL_API_KEY;
  }

  willSendRequest(request) {
    request.params.set('apiKey', this.apiKey);
  }

  async getAllAbsences() {
    const response = await this.get();
    return Array.isArray(response) ? response : [];
  }

  async getAbsencesById({ userId }) {
    const response = await this.get(`?user[]=${userId}`);
    return response;
  }
}

export default AbsenceAPI;
