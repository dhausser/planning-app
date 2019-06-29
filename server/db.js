import { MongoClient } from 'mongodb';

export default async () => {
  const client = await MongoClient.connect(process.env.DATABASE, {
    poolSize: 50,
    wtimeout: 2500,
    useNewUrlParser: true,
  }).catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });

  try {
    const resources = client.db('davyJSDB').collection('resources');
    return { resources };
  } catch (e) {
    console.error(
      `Unable to establish collection handles in resourceDAO: ${e}`,
    );
    return null;
  }
};
