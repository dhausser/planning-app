const mongoose = require('mongoose');

const Resource = mongoose.model('Resource');

exports.getTeams = async (req, res) => {
  const teams = await Resource.getTeams();
  res.json(teams.map(({ _id }) => _id));
};

exports.getResources = async (req, res) =>
  res.json(await Resource.getResources());
