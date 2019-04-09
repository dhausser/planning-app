const { DataSource } = require('apollo-datasource');

class ResourceAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getTeams() {
    const teams = this.store.resources.getTeams();
    return teams;
  }

  async getResources() {
    const resources = this.store.resources.find({});
    return resources;
  }
}

module.exports = ResourceAPI;
