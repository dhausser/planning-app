import absenceController from '../controllers/absenceController'

export default class AbsenceAPI {
  constructor() {
    this.baseURL = process.env.PORTAL_URL
  }

  willSendRequest(request) {
    request.params.set('apiKey', process.env.API_KEY)
  }

  async getAbsencesById({ userId }) {
    return absenceController.getAbsences({ userId })
  }
}
