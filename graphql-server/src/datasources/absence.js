/* eslint-disable class-methods-use-this */
const { RESTDataSource } = require('apollo-datasource-rest');
require('dotenv').config({ path: '.env' });

class AbsenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PORTAL_URL;
  }

  willSendRequest(request) {
    request.params.set('api_key', process.env.API_KEY);
  }

  async getAllAbsences() {
    const response = await this.get('user_absence');
    return Array.isArray(response) ? response : [];
  }

  async getAbsenceById({ absenceId }) {
    const response = await this.get(`user_absence?user[]=${absenceId}`);
    return response;
  }
}

module.exports = AbsenceAPI;
