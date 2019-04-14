import ResourcesDAO from './dao/resourcesDAO'

export default {
  hello: () => 'Hello world!',
  teams: async () => ResourcesDAO.getTeams(),
  resources: () => ResourcesDAO.getResources(),
}
