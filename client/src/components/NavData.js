import React from 'react'
import { colors } from '@atlaskit/theme'

export const Wrapper = props => (
  <div
    css={{
      backgroundColor: colors.N20,
      boxSizing: 'border-box',
      padding: '16px',
      // width: `${CONTENT_NAV_WIDTH}px`,
    }}
    {...props}
  />
)

export const projects = [
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

export const items = new Array(8)
  .fill(1)
  .map((x, i) => ({ text: `Item ${i + 1}` }))
