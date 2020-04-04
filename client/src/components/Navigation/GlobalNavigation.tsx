/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
import React, { FunctionComponent } from 'react';
import { GlobalItem } from '@atlaskit/navigation-next';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import GlobalNavigation from '@atlaskit/global-navigation';
import { JiraIcon } from '@atlaskit/logo';
import { useUserAvatar } from '../../lib/useUser';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const AppSwitcherComponent = (props: JSX.IntrinsicAttributes) => (
  <GlobalItem
    {...props}
    icon={AppSwitcherIcon}
    id="test"
    onClick={() => console.log('AppSwitcher clicked')}
  />
);

const SearchTooltip = () => (
  <div css={{ background: 'red' }}> Search Tooltip</div>
);

export const MyGlobalNavigation: FunctionComponent = () => (
  <GlobalNavigation
    productIcon={() => <JiraIcon size="medium" />}
    productTooltip="Jira"
    profileIconUrl={
      useUserAvatar() ||
      'https://api.adorable.io/avatars/285/abott@adorable.png'
    }
    productHref="#"
    searchTooltip={<SearchTooltip />}
    searchLabel="Search Label"
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
    loginHref="#login"
  />
);

export default MyGlobalNavigation;
