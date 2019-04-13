import { DataSource } from 'apollo-datasource'
import ResourcesDAO from '../dao/resourcesDAO'

export default class ResourceAPI extends DataSource {
  getResources = async () => ResourcesDAO.getResources()
  getResourcesByTeam = async (teams) => ResourcesDAO.getResourcesByTeam(teams)
  getTeams = async () => ResourcesDAO.getTeams()
}
