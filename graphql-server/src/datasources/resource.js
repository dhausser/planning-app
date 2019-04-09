const { DataSource } = require('apollo-datasource');
const { Resource } = require('../models');
const config = require('../config');

class ResourceAPI extends DataSource {
  constructor() {
    super();
    this.context = config;
  }

  async getTeams() {
    const teams = await Resource.getTeams();
    return teams;
  }

  async getResources() {
    const resources = await Resource.find({});
    return resources;
  }
}

module.exports = ResourceAPI;
