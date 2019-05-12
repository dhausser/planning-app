import { MongoClient } from 'mongodb'
import ResourcesDAO from './dao/resourcesDAO'

MongoClient.connect(process.env.DATABASE, { useNewUrlParser: true })
  .catch(err => {
    console.log(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await ResourcesDAO.injectDB(client)
  })
