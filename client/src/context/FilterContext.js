import React from 'react'
import { fixVersion } from '../credentials'

function setTeamFilter(args) {
  console.log(`Setting Team...${args.name}`)
}

function setFixVersion(args) {
  console.log(`Setting FixVersion...${args}`)
}

export const FilterContext = React.createContext({
  teams: [],
  fixVersion,
  teamFilter: null,
  setTeamFilter,
  setFixVersion,
})
