import React from 'react';
import { useQuery, gql } from '@apollo/client';
import GlobalNavigation from '@atlaskit/global-navigation';
import { GlobalItem } from '@atlaskit/navigation-next';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    myself {
      avatarUrls {
        small
      }
    }
  }
`;

function GetAvatarUrl(): HTMLImageElement {
  const { data } = useQuery(GET_CURRENT_USER);
  return (
    data &&
    data.myself &&
    data.myself.avatarUrls &&
    data.myself.avatarUrls.small
  );
}

export default function GlobalNav(): React.ReactElement {
  const { data } = useQuery(IS_LOGGED_IN);
  return (
    <GlobalNavigation
      productIcon={EmojiAtlassianIcon}
      productHref="/"
      appSwitcherComponent={<GlobalItem icon={AppSwitcherIcon} />}
      appSwitcherTooltip="Switch to ..."
      profileIconUrl={data.isLoggedIn ? GetAvatarUrl() : null}
    />
  );
}
