import React from 'react';
import PropTypes from 'prop-types';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import PageHeader from '@atlaskit/page-header';
import { NameWrapper } from './Page';
import Filters from './Filters/Filters';

const Header = ({ title, avatar }) => {
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
      <Filters />
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
};

Header.defaultProps = {
  avatar: null,
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  avatar: PropTypes.element,
};

export default Header;
