const { DataSource } = require('apollo-datasource');
const assert = require('assert');
const ResourcesDAO = require('../dao/resourcesDAO');

module.exports = class ResourceAPI extends DataSource {
  static async initialize(config) {
    this.context = config.context;
    this.context.resourceMap = await this.getResourceMap();
  }

  static async getResources(req, res, next) {
    const response = await ResourcesDAO.getResources();
    res.json(response);
  }

  static async getResourceMap(req, res, next) {
    const response = await ResourcesDAO.getResourceMap();
    res.json(response);
  }

  static async getResourceById(resourceId) {
    const response = await ResourcesDAO.getResourceById(resourceId);
    res.json(response);
  }

  static async getTeams(req, res, next) {
    const response = await ResourcesDAO.getTeams();
    res.json(response);
  }

  static async getResourcesByTeam(teamId) {
    const response = await ResourcesDAO.getResourcesByTeam(teamId);
    res.json(response);
  }

  static async updateResource({ id, firstname, lastname, team }) {
    const response = await ResourcesDAO.updateResource({
      id,
      firstname,
      lastname,
      team,
    });
    res.json(response);
  }

  static async deleteResource({ id }) {
    const response = await ResourcesDAO.getResources({ id });
    res.json(response);
  }

  static async insertManyResources() {
    const response = await ResourcesDAO.insertManyResources();
    res.json(response);
  }

  static async deleteManyResources() {
    const response = await ResourcesDAO.deleteManyResources();
    res.json(response);
  }
};
