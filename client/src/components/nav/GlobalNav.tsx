import React, { FunctionComponent } from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import { GlobalItem } from '@atlaskit/navigation-next';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { useUserAvatar } from '../../lib/useUser';

const GlobalNav: FunctionComponent = () => {
  return (
    <GlobalNavigation
      productIcon={EmojiAtlassianIcon}
      productHref="/"
      appSwitcherComponent={<GlobalItem icon={AppSwitcherIcon} />}
      appSwitcherTooltip="Switch to ..."
      profileIconUrl={useUserAvatar()}
    />
  );
};

export default GlobalNav;
