/* eslint-disable import/no-cycle */
import { DataSource } from "apollo-datasource";
import { PrismaClient } from "@prisma/client";
import {
  ApolloContext,
  ResourceInputs,
  Pagination,
  ResourceMap,
} from "../types";

import mockData from "../mocks/data.json";
// import mockIssues from '../mocks/issues.json';
// import mockProjects from '../mocks/projects.json';
// import mockVersions from '../mocks/versions.json';

const USE_MOCK_DATA = true;

class UserAPI extends DataSource {
  prisma: PrismaClient;

  constructor({ prisma }: ApolloContext) {
    super();
    this.prisma = prisma;
  }

  async findUsers({ offset, limit, teamId }: Pagination) {
    if (USE_MOCK_DATA) return mockData.resources;

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
    return Array.isArray(allUsers) ? allUsers : [];
  }

  async findUser({ id }: { id: string }) {
    if (USE_MOCK_DATA) return mockData.resources[0];

    const user = await this.prisma.user.findOne({ where: { key: id } });
    return user;
  }

  async findTeams() {
    if (USE_MOCK_DATA) return mockData.teams;

    const teams = await this.prisma.team.findMany({
      include: { members: true },
    });
    return Array.isArray(teams) ? teams : [];
  }

  async createUser({ firstname, lastname, position, team }: ResourceInputs) {
    const key = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
    const user = this.prisma.user.create({
      data: {
        key,
        email: key,
        name: `${firstname} ${lastname}`,
        position,
        team: {
          connect: { name: team },
        },
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
    const user = this.prisma.user.update({
      where: { key: id },
      data: {
        name: `${firstname} ${lastname}`,
        email: key,
        position,
        team: {
          connect: { name: team },
        },
      },
    });
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

  // async createAllUsers() {
  //   const allUsers = sampleResources.map(
  //     async ({ key, email, name, team, position }) => {
  //       return this.prisma.user.create({
  //         data: {
  //           key,
  //           email,
  //           name,
  //           position,
  //           team: {
  //             connect: { name: team },
  //           },
  //         },
  //       });
  //     }
  //   );
  //   return allUsers;
  // }

  async deleteAllUsers() {
    const deleteUsers = await this.prisma.user.deleteMany({});
    return deleteUsers.count;
  }

  async getAssignee({ teamId }: { teamId: string | undefined }) {
    let resources: Array<{ key: string }> = [];
    let assignee: string[] = [];
    if (teamId) {
      const team = await this.prisma.team.findOne({
        where: { id: parseInt(teamId, 10) },
        select: { members: { select: { key: true } } },
      });
      if (team) {
        assignee = team.members.map(({ key }) => key);
      }
    } else {
      resources = await this.prisma.user.findMany({ select: { key: true } });
      assignee = resources.map(({ key }) => key);
    }
    return assignee;
  }

  async getResourceMap() {
    const resources = await this.prisma.user.findMany({
      include: { team: { select: { name: true } } },
    });
    return resources.reduce<ResourceMap>((acc, resource) => {
      if (resource.key && resource.team) {
        acc[resource.key] = resource.team.name;
      }
      return acc;
    }, {});
  }
}

export default UserAPI;
