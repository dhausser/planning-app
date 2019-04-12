import React from 'react';

function setTeamFilter(args) {
  console.log(`Setting Team...${args.name}`);
}

function setFixVersion(args) {
  console.log(`Setting FixVersion...${args}`);
}

export const FilterContext = React.createContext({
  teams: [],
  fixVersion: { id: '15901', name: '2.2' },
  teamFilter: null,
  setTeamFilter,
  setFixVersion,
});
