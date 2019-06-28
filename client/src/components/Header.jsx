import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TextField from '@atlaskit/textfield';
import PageHeader from '@atlaskit/page-header';
import Button, { ButtonGroup } from '@atlaskit/button';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { ProjectFilter, VersionFilter, TeamFilter } from '.';

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

function Header({ title, avatar }) {
  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem text="Some project" key="Some project" />
      <BreadcrumbsItem text="Parent page" key="Parent page" />
    </BreadcrumbsStateless>
  );
  const actionsContent = (
    <ButtonGroup>
      <Button appearance="primary">Primary Action</Button>
      <Button>Default</Button>
      <Button>...</Button>
    </ButtonGroup>
  );
  const barContent = (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '0 0 200px' }}>
        <TextField isCompact placeholder="Filter" aria-label="Filter" />
      </div>
      <ProjectFilter />
      <VersionFilter />
      <TeamFilter />
    </div>
  );

  return (
    <>
      <PageHeader
        breadcrumbs={breadcrumbs}
        actions={actionsContent}
        bottomBar={barContent}
      >
        {avatar
          ? (
            <NameWrapper>
              {avatar}
              {title}
            </NameWrapper>
          )
          : title}
      </PageHeader>
    </>
  );
}

Header.defaultProps = {
  avatar: null,
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  avatar: PropTypes.element,
};

export default Header;
