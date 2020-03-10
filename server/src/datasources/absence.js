const { RESTDataSource } = require('apollo-datasource-rest');

module.exports = class AbsenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PORTAL_URL;
    this.apiKey = process.env.PORTAL_API_KEY;
  }

  async getAllAbsences() {
    const response = await this.get('', { apiKey: this.apiKey });
    return Array.isArray(response) ? response : [];
  }

  async getAbsencesById({ userId }) {
    return this.get(`?user[]=${userId}`, { apiKey: this.apiKey });
  }
};
