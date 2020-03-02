import { MongoClient } from "mongodb"
import ResourcesDAO from "./dao/resourcesDAO"
import app, { server } from './server'

const port = process.env.NODE_ENV === 'production' ? 8080 : 4000;

export default MongoClient.connect(
  process.env.ROADMAP_DB_URI,
  {
    poolSize: 50,
    wtimeout: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await ResourcesDAO.injectDB(client)
    app.listen(port, () => console.log(
      `MongoDB connection established\nServer ready at http://localhost:${port}${server.graphqlPath}`,
    ));
  })

// export default async () => {
//   const client = await MongoClient.connect(process.env.DATABASE, {
//     poolSize: 50,
//     wtimeout: 2500,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }).catch((err) => {
//     console.error(err.stack);
//     process.exit(1);
//   });

//   try {
//     const resources = client.db(process.env.DBNAME).collection('resources');
//     return { resources };
//   } catch (e) {
//     console.error(
//       `Unable to establish collection handles in resourceDAO: ${e}`,
//     );
//     return null;
//   }
// };
