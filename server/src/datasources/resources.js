import ResourcesDAO from '../dao/resourcesDAO'

export default class ResourceAPI {
  getResources = () => ResourcesDAO.getResources()

  getResourcesByTeam = teams => ResourcesDAO.getResourcesByTeam(teams)

  getTeams = () => ResourcesDAO.getTeams()
}
