const { RESTDataSource } = require('apollo-datasource-rest');

/**
 * TODO: Confinm that the Portal API is still valid
 */

module.exports = class AbsenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PORTAL_URL;
    this.apiKey = process.env.PORTAL_API_KEY;
  }

  async getAllAbsences() {
    const response = await this.get('', { apiKey: this.apiKey });
    console.log(response);
    return Array.isArray(response) ? response : [];
  }

  async getAbsencesById({ userId }) {
    console.log(userId);
    console.log(this.apiKey);
    const response = await this.get(`?user[]=${userId}`, {
      apiKey: this.apiKey,
    });
    console.log(response);
    return response;
  }
};
