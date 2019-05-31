import React from 'react'
import GlobalNavigation from '@atlaskit/global-navigation'
import { GlobalItem } from '@atlaskit/navigation-next'
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher'
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian'
import { hostname } from '../../credentials'

const AppSwitcherComponent = props => (
  <GlobalItem
    {...props}
    icon={AppSwitcherIcon}
    id="test"
    onClick={() => console.log('AppSwitcher clicked')}
  />
)

export default () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
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
    profileIconUrl={`https://${hostname}/secure/useravatar?ownerId=davy.hausser`}
  />
)
