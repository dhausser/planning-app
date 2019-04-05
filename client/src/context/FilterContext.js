import React from 'react';

function setTeam(args) {
  console.log(`Setting Team...${args.name}`);
}

function setFixVersion(args) {
  console.log(`Setting FixVersion...${args}`);
}
export const FilterContext = React.createContext({
  fixVersion: { id: '15900', name: '2.1' },
  team: '',
  setTeam,
  setFixVersion,
});
