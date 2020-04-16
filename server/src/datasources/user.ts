import { DataSource } from 'apollo-datasource';
import { ApolloContext, Resource, Pagination } from '../types';
import resources from '../../data/resources.json';
import teams from '../../data/teams.json';

class UserAPI extends DataSource {
  prisma: any;
  context: any;
  constructor({ prisma }: ApolloContext) {
    super();
    this.prisma = prisma;
  }

  async findUsers({ offset, limit, teamId }: Pagination) {
    console.log({ offset, limit, teamId });
    const allUsers = await this.prisma.user.findMany({ where: { team: teamId } });
    return Array.isArray(allUsers) ? allUsers : [];
  }

  async findUser({ id }: { id: string }) {
    const user = await this.prisma.user.findOne({ where: { key: id } });
    return user;
  }

  async findTeams() {
    return Array.isArray(teams) ? teams : [];
  }

  async getResourceMap() {
    const allUsers = await this.prisma.user.findMany();
    return allUsers.reduce((acc: any, resource: Resource) => {
      acc[resource.key] = resource.team;
      return acc;
    }, {});
  }

  async createUser() {
    const user = {};
    return user;
  }

  async updateUser() {
    const user = {};
    return user;
  }

  async deleteUser() {
    const user = {};
    return user;
  }

  async createAllTeams() {
    const allTeams = teams.map(async ({ id, name }) => {})
    return allTeams;
  }

  async createAllUsers() {
    const allUsers = resources.map(async ({
      key,
      email,
      name,
      team,
      position,
    }) => {
      return await this.prisma.user.create({
        data: {
          key,
          email,
          name,
          team,
          position,
        },
      });
    });
    return allUsers;
  }

  async deleteAllUsers() {
    const deleteUsers = await this.prisma.user.deleteMany({});
    return deleteUsers;
  }

  
}

export default UserAPI;
