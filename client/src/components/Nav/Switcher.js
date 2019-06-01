import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { colors } from '@atlaskit/theme'
import ChevD from '@atlaskit/icon/glyph/chevron-down'
import {
  ContainerHeader,
  ItemAvatar,
  Switcher,
  NavigationProvider,
} from '@atlaskit/navigation-next'
import Loading from '../Loading'
import Error from '../Error'

import { PROJECT_TILE_DATA, GET_FILTERS } from '../../queries'

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      ...ProjectTile
      avatarUrls {
        large
      }
    }
  }
  ${PROJECT_TILE_DATA}
`

const TOGGLE_PROJECT = gql`
  mutation toggleProject($project: Project!) {
    toggleProject(project: $project) @client
  }
`

export default function() {
  const [selected, setSelected] = useState({})
  const [options, setOptions] = useState([])
  const toggleProject = useMutation(TOGGLE_PROJECT)
  const {
    data: { project: filter },
  } = useQuery(GET_FILTERS)

  const { data, loading, error } = useQuery(GET_PROJECTS, {
    fetchPolicy: 'cache-first',
  })

  useEffect(() => {
    if (!loading && !error) {
      const relevant = []
      const garbage = []

      data.projects.forEach(project => {
        const option = {
          avatar: project.avatarUrls.large,
          id: project.id,
          pathname: `/projects/${project.key}`,
          text: project.name,
          subText: `${project.projectTypeKey} project`,
        }

        if (['10500', '16000', '16001'].includes(project.id)) {
          relevant.push(option)
        } else {
          garbage.push(option)
        }
      })

      const projects = [
        {
          label: 'Recent Projects',
          options: relevant,
        },
        {
          label: 'Other Projects',
          options: garbage,
        },
      ]

      const current =
        filter && [...relevant, ...garbage].find(({ id }) => id === filter.id)

      setOptions(projects)
      setSelected(current || projects[0].options[0])
    }
  }, [data.projects, error, filter, loading])

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  // const relevant = []
  // const garbage = []

  // data.projects.forEach(project => {
  //   const option = {
  //     avatar: project.avatarUrls.large,
  //     id: project.id,
  //     pathname: `/projects/${project.key}`,
  //     text: project.name,
  //     subText: `${project.projectTypeKey} project`,
  //   }

  //   if (['10500', '16000', '16001'].includes(project.id)) {
  //     relevant.push(option)
  //   } else {
  //     garbage.push(option)
  //   }
  // })

  // const options = [
  //   {
  //     label: 'Recent Projects',
  //     options: relevant,
  //   },
  //   {
  //     label: 'Other Projects',
  //     options: garbage,
  //   },
  // ]

  return (
    <NavigationProvider>
      <Wrapper>
        <Switcher
          create={create()}
          onChange={e => {
            toggleProject({
              variables: {
                project: {
                  value: e.id,
                  label: e.text,
                  __typename: 'FixVersion',
                },
              },
            })
            setSelected(e)
          }}
          options={options}
          target={target(selected)}
          value={selected}
        />
      </Wrapper>
    </NavigationProvider>
  )
}

const create = () => ({
  onClick: () => {
    // eslint-disable-next-line
    const boardName = window.prompt(
      'What would you like to call your new board?',
    )
    if (boardName && boardName.length) {
      // eslint-disable-next-line
      console.log(`You created the board "${boardName}"`);
    }
  },
  text: 'Create board',
})

const target = ({ id, subText, text, avatar }) => (
  <ContainerHeader
    before={s => <ItemAvatar appearance="square" itemState={s} src={avatar} />}
    after={ChevD}
    id={id}
    subText={subText}
    text={text}
  />
)

const Wrapper = props => (
  <div
    css={{
      backgroundColor: colors.N20,
      boxSizing: 'border-box',
      padding: '16px',
    }}
    {...props}
  />
)