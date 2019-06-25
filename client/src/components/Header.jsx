import React from 'react';
import PropTypes from 'prop-types';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import PageHeader from '@atlaskit/page-header';
import Filters from './Filters/Filters';

const Header = ({ title }) => {
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
        {title}
      </PageHeader>
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
