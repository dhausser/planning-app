import React, { useState } from 'react';
import { AtlassianLogo, AtlassianIcon } from '@atlaskit/logo';
import Popup from '@atlaskit/popup';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { PopupMenuGroup, Section, ButtonItem } from '@atlaskit/menu';
import { colors, borderRadius } from '@atlaskit/theme';
import {
  AtlassianNavigation,
  ProductHome,
  PrimaryButton,
  PrimaryDropdownButton,
} from '@atlaskit/atlassian-navigation';

import '@atlaskit/css-reset';

const ProductHomeExample = (): JSX.Element => (
  <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />
);

const PopupContents = (): JSX.Element => (
  <PopupMenuGroup>
    <Section>
      <ButtonItem
        description="But what is an Atlassian, anyway?"
        elemBefore={
          <QuestionCircleIcon
            primaryColor={colors.B300}
            label=""
            size="medium"
          />
        }
      >
        About
      </ButtonItem>
    </Section>
  </PopupMenuGroup>
);

const ExploreDropdown = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      content={PopupContents}
      isOpen={isOpen}
      placement="bottom-start"
      onClose={(): void => setIsOpen(false)}
      trigger={(triggerProps): React.ReactNode => (
        <PrimaryDropdownButton
          {...triggerProps}
          isSelected={isOpen}
          onClick={(): void => setIsOpen((prev) => !prev)}
        >
          Explore
        </PrimaryDropdownButton>
      )}
    />
  );
};

export default function App(): JSX.Element {
  return (
    <div
      style={{
        paddingBottom: 8,
        border: `1px solid ${colors.N40}`,
        borderRadius: borderRadius(),
      }}
    >
      <AtlassianNavigation
        label="site"
        primaryItems={[
          <PrimaryButton key="item">Issues</PrimaryButton>,
          <ExploreDropdown key="item" />,
        ]}
        renderProductHome={ProductHomeExample}
      />
    </div>
  );
}
