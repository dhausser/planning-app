import { RESTDataSource } from 'apollo-datasource-rest';

class AbsenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PORTAL_URL;
    this.apiKey = process.env.PORTAL_API_KEY;
  }

  async getAllAbsences() {
    const response = await this.get('', { apiKey: this.apiKey });
    return Array.isArray(response) ? response : [];
  }

  async getAbsencesById({ userId, secret, versionId }) {
    /**
     * TODO: Using @client fields as variables
     */
    // eslint-disable-next-line no-console
    console.log({ secret, versionId });
    const response = await this.get(`?user[]=${userId}`, { apiKey: this.apiKey });
    return response;
  }
}

export default AbsenceAPI;
