const assert = require('assert');

// eslint-disable-next-line no-unused-vars
let roadmap;
let resources;

module.exports = class ResourcesDAO {
  static async injectDB(conn) {
    if (resources) {
      return;
    }
    try {
      roadmap = await conn.db('davyJSDB');
      resources = await conn.db('davyJSDB').collection('resources');
      this.resources = resources; // this is only for testing
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in resourcesDAO: ${e}`,
      );
    }
  }

  /**
   * Finds and returns all resources.
   * Returns a list of objects, each object contains a key, name and a team
   * @returns {Promise<ResourcesResult>} A promise that will resolve to a list of ResourcesResult.
   */
  static async getResources() {
    let cursor;

    try {
      // cursor = await resources
      cursor = await resources.find().project({
        _id: 0,
        key: 1,
        name: 1,
        team: 1,
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
  static async getResourceMap() {
    let cursor;

    try {
      cursor = await resources.find().project({
        _id: 0,
        key: 1,
        name: 1,
        team: 1,
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
  static async getResourceById({ resourceId }) {
    let cursor;

    try {
      cursor = await resources.findOne(
        { key: resourceId },
        {
          projection: {
            _id: 0,
            key: 1,
            name: 1,
            team: 1,
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
  static async getTeams() {
    let cursor;
    try {
      cursor = await resources.aggregate([
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
  static async getResourcesByTeam({ teamId }) {
    let cursor;

    try {
      cursor = await resources.find({ team: teamId }).project({
        _id: 0,
        key: 1,
      });
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return [];
    }

    return cursor.toArray();
  }

  static async insertResource({ id, firstname, lastname, team }) {
    // eslint-disable-next-line no-unused-vars
    let cursor;

    const data = {
      key: id,
      name: `${firstname} ${lastname}`,
      team,
    };

    try {
      cursor = await resources.insertOne(data);
      assert.equal(1, cursor.insertedCount);
    } catch (e) {
      console.error(`Unable to issue command, ${e}`);
    }

    return data;
  }

  static async updateResource({ id, firstname, lastname, team }) {
    // eslint-disable-next-line no-unused-vars
    let cursor;

    const data = {
      key: id,
      name: `${firstname} ${lastname}`,
      team,
    };

    try {
      cursor = await resources.updateOne(data);
      assert.equal(1, cursor.matchedCount);
      assert.equal(1, cursor.modifiedCount);
    } catch (e) {
      console.error(`Unable to issue command, ${e}`);
    }

    return data;
  }

  static async deleteResource({ id }) {
    // eslint-disable-next-line no-unused-vars
    let cursor;

    try {
      cursor = await resources.deleteOne({ key: id });
      assert.equal(1, cursor.deletedCount);
    } catch (e) {
      console.error(`Unable to issue command, ${e}`);
    }

    return id;
  }

  static async insertManyResources(newResources) {
    // eslint-disable-next-line no-unused-vars
    let cursor;

    try {
      cursor = await resources.insertMany(newResources);
      assert.equal(1, cursor.insertedCount);
    } catch (e) {
      console.error(`Unable to issue command, ${e}`);
    }

    return null;
  }

  static async deleteManyResources() {
    // eslint-disable-next-line no-unused-vars
    let cursor;

    try {
      cursor = await resources.deleteMany({});
      assert.equal(1, cursor.deletedCount);
    } catch (e) {
      console.error(`Unable to issue command, ${e}`);
    }

    return null;
  }
};
