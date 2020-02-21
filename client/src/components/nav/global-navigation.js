import React from "react"
import { useQuery, gql } from "@apollo/client"
import GlobalNavigation from "@atlaskit/global-navigation"
import { GlobalItem } from "@atlaskit/navigation-next"
import AppSwitcherIcon from "@atlaskit/icon/glyph/app-switcher"
import EmojiAtlassianIcon from "@atlaskit/icon/glyph/emoji/atlassian"

const IS_LOGGED_IN = gql`
  {
    isAuthenticated @client
  }
`

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
    onClick={() => console.log("AppSwitcher clicked")}
  />
)

function GetAvatarUrl() {
  const { data } = useQuery(GET_CURRENT_USER)
  return (
    data &&
    data.myself &&
    data.myself.avatarUrls &&
    data.myself.avatarUrls.small
  )
}

export default () => {
  const { data: { isAuthenticated } } = useQuery(IS_LOGGED_IN)
  return (
    <GlobalNavigation
      productIcon={EmojiAtlassianIcon}
      productHref="/"
      onProductClick={() => console.log("product clicked")}
      onCreateClick={() => console.log("create clicked")}
      onSearchClick={() => console.log("search clicked")}
      onStarredClick={() => console.log("starred clicked")}
      onHelpClick={() => console.log("help clicked")}
      helpItems={() => <div />}
      onNotificationClick={() => console.log("notification clicked")}
      appSwitcherComponent={AppSwitcherComponent}
      appSwitcherTooltip="Switch to ..."
      onSettingsClick={() => console.log("settings clicked")}
      profileItems={() => <div />}
      profileIconUrl={isAuthenticated ? GetAvatarUrl() : null}
    />
  )
}
