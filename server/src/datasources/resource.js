import { DataSource } from 'apollo-datasource'
import ResourcesDAO from '../dao/resourcesDAO'

export default class ResourceAPI extends DataSource {
  getResources = async () => ResourcesDAO.getResources()

  getResourceById = async resourceId => ResourcesDAO.getResourceById(resourceId)

  getTeams = async () => ResourcesDAO.getTeams()

  getResourcesByTeam = async teamId => ResourcesDAO.getResourcesByTeam(teamId)
}
