/* eslint-disable class-methods-use-this */
const { RESTDataSource } = require('apollo-datasource-rest');
require('dotenv').config({ path: '.env' });

class AbsenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PORTAL_URL;
  }

  willSendRequest(request) {
    console.log(process.env.API_KEY);
    console.log(process.env.PORTAL_URL);
    request.params.set('apiKey', process.env.API_KEY);
  }

  async getAllAbsences() {
    const response = await this.get('user_absences');
    return Array.isArray(response) ? response : [];
  }

  async getAbsencesById({ userId }) {
    console.log(userId);
    const response = await this.get(`?user[]=${userId}`);
    console.log(response);
    return response;
  }
}

module.exports = AbsenceAPI;
