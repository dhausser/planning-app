/* eslint-disable class-methods-use-this */
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
    const { Resource } = this.context;
    const teams = await Resource.getTeams();
    return teams.map(({ _id }) => _id);
  }

  async getResources() {
    const { Resource } = this.context;
    const resources = await Resource.getResources();
    return resources;
  }
}

module.exports = ResourceAPI;
