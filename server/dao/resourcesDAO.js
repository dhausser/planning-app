const assert = require('assert');

// eslint-disable-next-line no-unused-vars
let roadmap;
let resources;
const DEFAULT_SORT = [['team', -1]];

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
   * Retrieves the connection pool size, write concern and user roles on the
   * current client.
   * @returns {Promise<ConfigurationResult>} An object with configuration details.
   */
  static async getConfiguration() {
    const roleInfo = await roadmap.command({ connectionStatus: 1 });
    const authInfo = roleInfo.authInfo.authenticatedUserRoles[0];
    const { poolSize, wtimeout } = resources.s.db.serverConfig.s.options;
    const response = {
      poolSize,
      wtimeout,
      authInfo,
    };
    return response;
  }

  /**
   * Finds and returns all resources.
   * Returns a list of objects, each object contains a key, name and a team
   * @returns {Promise<ResourcesResult>} A promise that will resolve to a list of ResourcesResult.
   */
  static async getResources({ page = 0, resourcesPerPage = 20 } = {}) {
    const queryParams = {};
    const {
      query = {},
      project = { _id: 0 },
      sort = DEFAULT_SORT,
    } = queryParams;
    let cursor;
    try {
      cursor = await resources.find(query).project(project).sort(sort);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { resourcesList: [], totalNumResources: 0 };
    }

    /**
    Ticket: Paging

    Before this method returns back to the API, use the "moviesPerPage" and
    "page" arguments to decide the movies to display.

    Paging can be implemented by using the skip() and limit() cursor methods.
    */

    // TODO Ticket: Paging
    // Use the cursor to only return the movies that belong on the current page
    const displayCursor = cursor
      .limit(resourcesPerPage)
      .skip(resourcesPerPage * page);

    try {
      const resourcesList = await displayCursor.toArray();
      const totalNumResources =
        page === 0 ? await resources.countDocuments(query) : 0;

      return { resourcesList, totalNumResources };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      );
      return { resourcesList: [], totalNumResources: 0 };
    }
  }

  /**
   * Finds and returns resources originating from one or more teams.
   * Returns a list of objects, each object contains a key, name and a team
   * @param {string[]} teams - The list of teams.
   * @returns {Promise<ResourcesByTeamResult>} A promise that will resolve to
   * a list of ResourcesByTeamResult.
   */
  static async getResourcesByTeam({ teamId, page = 0, resourcesPerPage = 20 }) {
    const queryParams = {};

    console.log({ teamId });

    const {
      query = {},
      project = { _id: 0 },
      sort = DEFAULT_SORT,
    } = queryParams;
    let cursor;
    try {
      cursor = await resources
        .find({ team: teamId })
        .project(project)
        .sort(sort);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }

    const displayCursor = cursor
      .limit(resourcesPerPage)
      .skip(resourcesPerPage * page);

    try {
      const resourcesList = await displayCursor.toArray();
      const totalNumResources =
        page === 0 ? await resources.countDocuments(query) : 0;

      cursor = await resources.find({ team: teamId }).project({
        _id: 0,
        key: 1,
      });
      return { resourcesList, totalNumResources };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { resourcesList: [], totalNumResources: 0 };
    }
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
