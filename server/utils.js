const { MongoClient } = require('mongodb');
const ResourcesDAO = require('./dao/resourcesDAO');

module.exports.createStore = () => MongoClient.connect(
  process.env.DATABASE,
  {
    poolSize: 50,
    wtimeout: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
)
  .catch((err) => {
    reject(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ResourcesDAO.injectDB(client);
    console.log('MongoDB connection established');
    resolve();
  }


// module.exports = new Promise((resolve, reject) => MongoClient.connect(
//   process.env.DATABASE,
//   {
//     poolSize: 50,
//     wtimeout: 2500,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
// )
//   .catch((err) => {
//     reject(err.stack);
//     process.exit(1);
//   })
//   .then(async (client) => {
//     await ResourcesDAO.injectDB(client);
//     console.log('MongoDB connection established');
//     resolve();
//   }));


  // module.exports.createStore = () => {
  //   const db = new Sequelize({
  //     dialect: 'sqlite',
  //     storage: './store.sqlite'
  //   });
  
  //   const users = db.define('user', {
  //     createdAt: Sequelize.DATE,
  //     updatedAt: Sequelize.DATE,
  //     email: Sequelize.STRING,
  //     profileImage: Sequelize.STRING,
  //     token: Sequelize.STRING,
  //   });
  
  //   const trips = db.define('trip', {
  //     createdAt: Sequelize.DATE,
  //     updatedAt: Sequelize.DATE,
  //     launchId: Sequelize.INTEGER,
  //     userId: Sequelize.INTEGER,
  //   });
  
  //   return { db, users, trips };
  // };