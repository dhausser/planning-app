const { DataSource } = require('apollo-datasource');
const assert = require('assert');

module.exports = class ResourceAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  async initialize(config) {
    this.context = config.context;
    this.store = await this.store;
    this.context.resourceMap = await this.getResourceMap();
  }

  /**
   * Finds and returns all resources.
   * Returns a list of objects, each object contains a key, name and a team
   * @returns {Promise<ResourcesResult>} A promise that will resolve to a list of ResourcesResult.
   */
  async getResources() {
    let cursor;

    try {
      cursor = await this.store.resources
        .find()
        .project({
          _id: 0, key: 1, name: 1, team: 1,
        });
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return [];
    }

    return cursor.toArray();
  }

  /**
   * Finds and returns all resources.
   * Returns a list of objects, each object contains a key, name and a team
   * @returns {Promise<ResourcesMap>} A promise that will resolve to a list of ResourcesResult.
   */
  async getResourceMap() {
    let cursor;

    try {
      cursor = await this.store.resources
        .find()
        .project({
          _id: 0, key: 1, name: 1, team: 1,
        });
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return [];
    }

    const array = await cursor.toArray();

    return array.reduce((acc, resource) => {
      acc[resource.key] = resource.team;
      return acc;
    }, {});
  }

  /**
   * Finds and returns resource for given id.
   * Returns an object, each object contains a key, name and a team
   * @param {string[]} resourceId - The list of teams.
   * @returns {Promise<ResourcesResult>} A promise that will resolve to a list of ResourcesResult.
   */
  async getResourceById(resourceId) {
    let cursor;

    try {
      cursor = await this.store.resources.findOne(
        { key: resourceId },
        {
          projection: {
            _id: 0, key: 1, name: 1, team: 1,
          },
        },
      );
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return [];
    }

    return cursor;
  }

  /**
   * Finds and returns all teams.
   * Returns a list of objects, each object contains a _id, size and members
   * @param {string[]} teams - The list of teams.
   * @returns {Promise<TeamsResult>} A promise that will resolve to a list of TeamResults.
   */
  async getTeams() {
    let cursor;
    try {
      cursor = await this.store.resources
        .aggregate([
          {
            $group: {
              _id: '$team',
              members: { $push: '$$ROOT' },
            },
          },
          {
            $project: {
              _id: 0,
              id: '$_id',
              name: '$_id',
              members: 1,
            },
          },
          {
            $addFields: { count: 0 },
          },
          {
            $sort: { id: 1 },
          },
        ]);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return [];
    }

    return cursor.toArray();
  }

  /**
   * Finds and returns resources originating from one or more teams.
   * Returns a list of objects, each object contains a key, name and a team
   * @param {string[]} teams - The list of teams.
   * @returns {Promise<ResourcesByTeamResult>} A promise that will resolve to
   * a list of ResourcesByTeamResult.
   */
  async getResourcesByTeam(teamId) {
    let cursor;

    console.log(teamId);

    try {
      cursor = await this.store.resources
        .find({ team: teamId })
        .project({
          _id: 0, key: 1,
        });
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return [];
    }

    return cursor.toArray();
  }

  async insertResource({
    id, firstname, lastname, team,
  }) {
    // eslint-disable-next-line no-unused-vars
    let cursor;

    const data = {
      key: id,
      name: `${firstname} ${lastname}`,
      team,
    };

    try {
      cursor = await this.store.resources.insertOne(data);
      assert.equal(1, cursor.insertedCount);
    } catch (e) {
      console.error(`Unable to issue command, ${e}`);
    }

    return data;
  }

  async updateResource({
    id, firstname, lastname, team,
  }) {
    // eslint-disable-next-line no-unused-vars
    let cursor;

    const data = {
      key: id,
      name: `${firstname} ${lastname}`,
      team,
    };

    try {
      cursor = await this.store.resources.updateOne(data);
      assert.equal(1, cursor.matchedCount);
      assert.equal(1, cursor.modifiedCount);
    } catch (e) {
      console.error(`Unable to issue command, ${e}`);
    }

    return data;
  }

  async deleteResource({ id }) {
    // eslint-disable-next-line no-unused-vars
    let cursor;

    try {
      cursor = await this.store.resources.deleteOne({ key: id });
      assert.equal(1, cursor.deletedCount);
    } catch (e) {
      console.error(`Unable to issue command, ${e}`);
    }

    return id;
  }
};
