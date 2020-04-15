import { RESTDataSource } from 'apollo-datasource-rest';

class AbsenceAPI extends RESTDataSource {
  apiKey: string | undefined;
  constructor() {
    super();
    this.baseURL = process.env.PORTAL_URL;
    this.apiKey = process.env.PORTAL_API_KEY;
  }

  async getAllAbsences() {
    const response = await this.get('', { apiKey: this.apiKey });
    return Array.isArray(response) ? response : [];
  }

  async getAbsencesById({ userId }: { userId: string }) {
    const response = await this.get(`?user[]=${userId}`, {
      apiKey: this.apiKey,
    });
    return Array.isArray(response) ? response : [];
  }
};

export default AbsenceAPI;
