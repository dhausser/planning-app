const { RESTDataSource } = require('apollo-datasource-rest');
require('dotenv').config({ path: '.env' });

class AbsenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PORTAL_URL;
  }

  willSendRequest(request) {
    request.params.set('apiKey', process.env.API_KEY);
  }

  async getAllAbsences() {
    const response = await this.get('user_absences');
    return Array.isArray(response) ? response : [];
  }

  async getAbsencesById({ userId }) {
    const response = await this.get(`?user[]=${userId}`);
    return response;
  }
}

module.exports = AbsenceAPI;
