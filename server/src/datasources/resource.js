import { DataSource } from 'apollo-datasource'

let resources

export default class ResourceAPI extends DataSource {
  static async injectDB(conn) {
    if (resources) {
      return
    }
    try {
      await conn.db(process.env.PLANIFY_NS)
      resources = await conn.db(process.env.PLANIFY_NS).collection('resources')
    } catch (e) {
      console.error(
        `Unable to establish collection handles in resourceDAO: ${e}`,
      )
    }
  }

  /**
   * Finds and returns all resources.
   * Returns a list of objects, each object contains a key, name and a team
   * @returns {Promise<ResourcesResult>} A promise that will resolve to a list of ResourcesResult.
   */
  async getResources() {
    let cursor

    try {
      cursor = await resources
        .find()
        .project({ _id: 0, key: 1, name: 1, team: 1 })
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return []
    }

    return cursor.toArray()
  }

  /**
   * Finds and returns all resources.
   * Returns a list of objects, each object contains a key, name and a team
   * @returns {Promise<ResourcesResult>} A promise that will resolve to a list of ResourcesResult.
   */
  static async getResources() {
    let cursor

    try {
      cursor = await resources
        .find()
        .project({ _id: 0, key: 1, name: 1, team: 1 })
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return []
    }

    return cursor.toArray()
  }

  /**
   * Finds and returns resource for given id.
   * Returns an object, each object contains a key, name and a team
   * @param {string[]} resourceId - The list of teams.
   * @returns {Promise<ResourcesResult>} A promise that will resolve to a list of ResourcesResult.
   */
  async getResourceById({ resourceId }) {
    let cursor

    try {
      cursor = await resources.findOne(
        { key: resourceId },
        { projection: { _id: 0, key: 1, name: 1, team: 1 } },
      )
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return []
    }

    return cursor
  }

  /**
   * Finds and returns all teams.
   * Returns a list of objects, each object contains a _id, size and members
   * @param {string[]} teams - The list of teams.
   * @returns {Promise<TeamsResult>} A promise that will resolve to a list of TeamResults.
   */
  async getTeams() {
    let cursor
    try {
      cursor = await resources
        .aggregate([
          {
            $group: {
              _id: '$team',
              members: { $push: '$$ROOT' },
              size: { $sum: 1 },
            },
          },
        ])
        .project({ _id: 1, size: 1, members: 1 })
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return []
    }

    return cursor.toArray()
  }

  /**
   * Finds and returns resources originating from one or more teams.
   * Returns a list of objects, each object contains a key, name and a team
   * @param {string[]} teams - The list of teams.
   * @returns {Promise<ResourcesByTeamResult>} A promise that will resolve to a list of ResourcesByTeamResult.
   */
  async getResourcesByTeam({ teamId }) {
    let cursor

    try {
      cursor = await resources
        .find({ team: teamId })
        .project({ _id: 0, key: 1, name: 1, team: 1 })
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return []
    }

    return cursor.toArray()
  }

  /**
   * Inserts and returns all resources.
   * Returns a list of objects, each object contains a key, name and a team
   * @returns {Promise<ResourcesResult>} A promise that will resolve to a list of ResourcesResult.
   */
  static async setResources(data) {
    try {
      console.log('Deleting Data...')
      await resources.deleteMany()
      console.log('Data successfully deleted')
    } catch (e) {
      console.error(e)
    }
    try {
      resources.insertMany(data)
      console.log('Database successfully updated')
    } catch (e) {
      console.log('\nError importing data')
      console.log(e)
    }
  }
}
