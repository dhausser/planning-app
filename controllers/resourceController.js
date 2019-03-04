const mongoose = require('mongoose');
const Resource = mongoose.model('Resource');

exports.getTeams = async (req, res) => {
  const resourcesPromise = Resource.getResources();
  const teamsPromise = Resource.getTeams();
  const [resources, teams] = await Promise.all([
    resourcesPromise,
    teamsPromise,
  ]);

  res.json({ teams, resources });
};

exports.getResources = async (req, res) =>
  res.json(await Resource.getResources());
