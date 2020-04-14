const { DataSource } = require('apollo-datasource');

class UserAPI extends DataSource {
  constructor({ prisma }) {
    super();
    this.prisma = prisma;
  }

  initialize(config) {
    this.context = config.context;
  }

  async findUsers() {
    const allUsers = await this.prisma.user.findMany();
    return Array.isArray(allUsers) ? allUsers : [];
  }

  async findUser({ id }) {
    const user = await this.prisma.user.findOne({ where: { key: id } });
    return user;
  }
}

module.exports = UserAPI;
