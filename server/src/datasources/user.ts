import { DataSource } from 'apollo-datasource';
import { ApolloContext } from '../types';

class UserAPI extends DataSource {
  prisma: any;
  context: any;
  constructor({ prisma }: ApolloContext) {
    super();
    this.prisma = prisma;
  }

  async findUsers() {
    const allUsers = await this.prisma.user.findMany();
    return Array.isArray(allUsers) ? allUsers : [];
  }

  async findUser({ id }: { id: string }) {
    const user = await this.prisma.user.findOne({ where: { key: id } });
    return user;
  }
}

export default UserAPI;
