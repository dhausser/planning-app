import { DataSource } from 'apollo-datasource';
import { PrismaClient } from '@prisma/client';
import { ApolloContext, Resource, ResourceInputs, Pagination } from '../types';
import resources from '../data/resources.json';

class UserAPI extends DataSource {
  prisma: PrismaClient;

  constructor({ prisma }: ApolloContext) {
    super();
    this.prisma = prisma;
  }

  async findUsers({ offset, limit, teamId }: Pagination) {
    const where = teamId ? { teamId: parseInt(teamId, 10) } : {};
    const include = { team: true };
    const first = limit;
    const skip = offset;
    const allUsers = await this.prisma.user.findMany({
      where,
      include,
      first,
      skip,
    });
    console.log({ offset, limit, teamId });
    return Array.isArray(allUsers) ? allUsers : [];
  }

  async findUser({ id }: { id: string }) {
    const user = await this.prisma.user.findOne({ where: { key: id } });
    return user;
  }

  async findTeams() {
    const teams = await this.prisma.team.findMany({
      include: { members: true },
    });
    return Array.isArray(teams) ? teams : [];
  }

  async getResourceMap() {
    const allUsers = await this.prisma.user.findMany();
    return allUsers.reduce((acc: any, resource: any) => {
      acc[resource.key] = resource.teamId;
      return acc;
    }, {});
  }

  async createUser({ firstname, lastname, position, team }: ResourceInputs) {
    const key = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
    const user = this.prisma.user.create({
      data: {
        key,
        email: `${key}@cdprojektred.com`,
        name: `${firstname} ${lastname}`,
        position,
        // team,
      },
    });
    return user;
  }

  async updateUser({
    id,
    firstname,
    lastname,
    position,
    team,
  }: ResourceInputs) {
    const key = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
    const where = { key: id };
    const data = {
      name: `${firstname} ${lastname}`,
      email: `${key}@cdprojektred.com`,
      position,
      // team,
    };
    const user = this.prisma.user.update({ where, data });
    return user;
  }

  async deleteUser({ id }: { id: string }) {
    const user = await this.prisma.user.delete({
      where: { key: id },
    });
    return user;
  }

  // async createAllTeams() {
  //   const allTeams = teams.map(async ({ id, name }) => {})
  //   return allTeams;
  // }

  async createAllUsers() {
    const allUsers = resources.map(
      async ({ key, email, name, team, position }) => {
        return this.prisma.user.create({
          data: {
            key,
            email,
            name,
            position,
            // team,/
          },
        });
      }
    );
    return allUsers;
  }

  async deleteAllUsers() {
    const deleteUsers = await this.prisma.user.deleteMany({});
    return deleteUsers.count;
  }
}

export default UserAPI;
