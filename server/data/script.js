import { PrismaClient } from '@prisma/client';
import resources from './resources.json';

const prisma = new PrismaClient();

async function main() {
  resources.forEach(async ({
    key,
    email,
    name,
    team,
    position,
  }) => {
    await prisma.user.create({
      data: {
        key,
        email,
        name,
        team,
        position,
      },
    });
  });
  // const deleteUsers = await prisma.user.deleteMany({});
  const allUsers = await prisma.user.findMany();
  console.log(allUsers.length);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.disconnect();
  });
