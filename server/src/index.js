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
