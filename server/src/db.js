import app from "./server"
import { MongoClient } from "mongodb"
import ResourcesDAO from "../src/dao/resourcesDAO"

const port = process.env.PORT || 8000

MongoClient.connect(
  process.env.DATABASE,
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
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
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
