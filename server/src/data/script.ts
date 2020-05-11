import { PrismaClient } from '@prisma/client';
import resources from './resources.json';
// import resources from './resources-sample.json';
import teams from './teams.json';

const prisma = new PrismaClient();

async function main() {
  teams.forEach(async ({ key, name, type }) => {
    await prisma.team.create({
      data: {
        key,
        name,
        type,
      },
    });
  });
  resources.forEach(async ({ key, email, name, team, position }) => {
    const teamKey = team.toLocaleLowerCase();
    // console.log(teamKey);
    await prisma.user.create({
      data: {
        key,
        email,
        name,
        position,
        team: {
          connect: { key: teamKey },
        },
      },
    });
  });

  // const deleteTeams = await prisma.team.deleteMany({});
  // const deleteUsers = await prisma.user.deleteMany({});

  const allUsers = await prisma.user.findMany();
  console.log('Users: ', allUsers.length);
  const allTeams = await prisma.team.findMany();
  console.log('Teams: ', allTeams.length);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.disconnect();
  });
