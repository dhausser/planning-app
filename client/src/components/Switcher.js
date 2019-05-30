import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { colors } from '@atlaskit/theme'
import ChevD from '@atlaskit/icon/glyph/chevron-down'
import {
  ContainerHeader,
  ItemAvatar,
  Switcher,
  NavigationProvider,
} from '@atlaskit/navigation-next'
import { Loading, Error } from '.'

import { GET_PROJECTS } from '../queries'

export default function() {
  const [selected, setSelected] = useState(projects[0].options[0])
  // const [options, setOptions] = useState([])
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    fetchPolicy: 'cache-first]',
  })

  // useEffect(() => {
  //   setOptions(
  //     data.projects.map(project => ({
  //       avatar: project.avatarUrls.small,
  //       id: project.id,
  //       pathname: `/projects/${project.key}`,
  //       text: project.name,
  //       subText: `${project.projectTypeKey} project`,
  //     })),
  //   )
  // }, [data.projects, options])

  if (loading) return <Loading />
  if (error) return <Error error={error} />

  const options = data.projects.map(project => ({
    avatar: project.avatarUrls.small,
    id: project.id,
    pathname: `/projects/${project.key}`,
    text: project.name,
    subText: `${project.projectTypeKey} project`,
  }))

  return (
    <NavigationProvider>
      <Wrapper>
        <Switcher
          create={create()}
          onChange={() => setSelected(selected)}
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

const target = ({ id, subText, text }) => {
  const avatar = s => (
    <ItemAvatar
      appearance="square"
      href={null}
      isInteractive={false}
      itemState={s}
      onClick={null}
    />
  )

  return (
    <ContainerHeader
      before={avatar}
      after={ChevD}
      id={id}
      subText={subText}
      text={text}
    />
  )
}

const onChange = selected => {
  this.setState({ selected })
}

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
const projects = [
  {
    label: 'Recent Projects',
    options: [
      {
        avatar: 'endeavour',
        id: 'endeavour',
        pathname: '/projects/endeavour',
        text: 'Endeavour',
        subText: 'Software project',
      },
      {
        avatar: 'design-system-support',
        id: 'design-system-support',
        pathname: '/projects/design-system-support',
        text: 'Design System Support',
        subText: 'Service desk project',
      },
    ],
  },
  {
    label: 'Other Projects',
    options: [
      {
        avatar: 'design-platform',
        id: 'design-platform',
        pathname: '/projects/design-platform',
        text: 'Design Platform',
        subText: 'Software project',
      },
      {
        avatar: 'donut-world',
        id: 'donut-world',
        pathname: '/projects/donut-world',
        text: 'Donut World',
        subText: 'Software project',
      },
      {
        avatar: 'kitkat',
        id: 'kitkat',
        pathname: '/projects/kitkat',
        text: 'KitKat',
        subText: 'Software project',
      },
      {
        avatar: 'tangerine',
        id: 'tangerine',
        pathname: '/projects/tangerine',
        text: 'Tangerine',
        subText: 'Software project',
      },
    ],
  },
]
