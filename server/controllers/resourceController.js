import mongoose from 'mongoose';

const Resource = mongoose.model('Resource');

export async function getTeams(req, res) {
  const teams = await Resource.getTeams();
  res.json(teams.map(({ _id }) => _id));
}

export async function getResources(req, res) {
  return res.json(await Resource.getResources());
}
