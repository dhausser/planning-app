/* eslint-disable no-console */
import React from 'react'
import { useQuery, gql } from '@apollo/client'
import GlobalNavigation from '@atlaskit/global-navigation'
import { GlobalItem } from '@atlaskit/navigation-next'
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher'
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian'
import { IS_LOGGED_IN } from "../.."

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    myself {
      avatarUrls {
        small
      }
    }
  }
`

const AppSwitcherComponent = () => (
  <GlobalItem
    icon={AppSwitcherIcon}
    id="test"
    onClick={() => console.log('AppSwitcher clicked')}
  />
)

function GetAvatarUrl() {
  const { data } = useQuery(GET_CURRENT_USER)
  return data?.myself?.avatarUrls?.small
  // return data && data.myself && data.myself.avatarUrls && data?.myself?.avatarUrls?.small
}

export default () => {
  const { data } = useQuery(IS_LOGGED_IN)
  return (
    <GlobalNavigation
      productIcon={EmojiAtlassianIcon}
      productHref="/"
      onProductClick={() => console.log('product clicked')}
      onCreateClick={() => console.log('create clicked')}
      onSearchClick={() => console.log('search clicked')}
      onStarredClick={() => console.log('starred clicked')}
      onHelpClick={() => console.log('help clicked')}
      helpItems={() => <div />}
      onNotificationClick={() => console.log('notification clicked')}
      appSwitcherComponent={AppSwitcherComponent}
      appSwitcherTooltip="Switch to ..."
      onSettingsClick={() => console.log('settings clicked')}
      profileItems={() => <div />}
      profileIconUrl={data.isLoggedIn ? GetAvatarUrl() : null}
    />
  )
}
