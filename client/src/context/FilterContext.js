import React from 'react'
import { fixVersion } from '../credentials'

function setTeams(args) {
  console.log(`Setting Teams...${args.name}`)
}

function setTeamFilter(args) {
  console.log(`Setting TeamFitler...${args.name}`)
}

function setFixVersion(args) {
  console.log(`Setting FixVersion...${args}`)
}

export const FilterContext = React.createContext({
  teams: [],
  setTeams,
  fixVersion,
  setFixVersion,
  teamFilter: null,
  setTeamFilter,
})
