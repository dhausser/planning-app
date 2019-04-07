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

  async getTeams(req, res) {
    const Resource = this.context.resourceSchema;
    const teams = await Resource.getTeams();
    res.json(teams.map(({ _id }) => _id));
  }

  async getResources(req, res) {
    const Resource = this.context.resourceSchema;
    const resources = await Resource.getResources();
    res.json(resources);
  }
}

module.exports = ResourceAPI;
