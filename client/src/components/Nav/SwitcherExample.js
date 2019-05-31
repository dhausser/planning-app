// @flow

import React from 'react'
import { colors } from '@atlaskit/theme'
import ChevD from '@atlaskit/icon/glyph/chevron-down'
import {
  ContainerHeader,
  Item,
  ItemAvatar,
  SectionHeading,
  Switcher,
  NavigationProvider,
} from '@atlaskit/navigation-next'

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
export const projects = [
  {
    label: 'Recent Projects',
    options: [
      {
        avatar: 'Gwent',
        id: 'gwent',
        pathname: '/projects/gwent',
        text: 'Endeavour',
        subText: 'Software project',
      },
      {
        avatar: 'Gwent Design',
        id: 'gwent-code',
        pathname: '/projects/design-system-support',
        text: 'Design System Support',
        subText: 'Service desk project',
      },
      {
        avatar: 'Gwent Code',
        id: 'gwent-design',
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
const items = new Array(8).fill(1).map((x, i) => ({ text: `Item ${i + 1}` }))

export default class MySwitcher extends React.Component {
  state = { selected: projects[0].options[0] }

  create = () => ({
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

  target = ({ id, subText, text }) => {
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

  onChange = selected => {
    this.setState({ selected })
  }

  render() {
    const { selected } = this.state
    return (
      <NavigationProvider>
        <Wrapper>
          <Switcher
            create={this.create()}
            onChange={this.onChange}
            options={projects}
            target={this.target(selected)}
            value={selected}
          />
          <SectionHeading>Section heading</SectionHeading>
          {items.map(p => (
            <Item key={p.text} {...p} />
          ))}
        </Wrapper>
      </NavigationProvider>
    )
  }
}
