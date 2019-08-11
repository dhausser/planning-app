import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import DynamicTable from '@atlaskit/dynamic-table';
import Avatar from '@atlaskit/avatar';
import EmptyState from '@atlaskit/empty-state';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import { ProjectHomeView, Layout } from '.';
import { TeamFilter } from './Filters';

const GET_FILTER = gql`
  query GetFilter {
    filter @client {
      team {
        id
        name
      }
    }
  }
`;

const GET_RESOURCES = gql`
  query GetResources($teamId: String) {
    filter @client {
      team {
        id @export(as: "teamId")
      }
    }
    resources(teamId: $teamId) {
      key
      name
      team
    }
  }
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <TeamFilter />
  </div>
);

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const head = {
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
    },
    {
      key: 'team',
      content: 'Team',
      isSortable: true,
      width: 15,
    },
  ],
};

const rows = resources => resources.map(resource => ({
  key: resource.key,
  cells: [
    {
      key: createKey(resource.name),
      content: (
        <NameWrapper>
          <Avatar
            name={resource.name}
            size="medium"
            src={`https://${
              process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${
              resource.key
            }`}
          />
          <Link to={`/resource/${resource.key}`}>{resource.name}</Link>
        </NameWrapper>
      ),
    },
    {
      key: createKey(resource.team),
      content: resource.team,
    },
  ],
}));

function Resources({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);

  const { data: { filter: { team } } } = useQuery(GET_FILTER);

  const { data, loading, error } = useQuery(GET_RESOURCES);

  let resources = [];
  if (error) return <EmptyState header={error.name} description={error.message} />;
  if (!loading) {
    resources = team.id
      ? data.resources.filter(resource => resource.team === team.id)
      : data.resources;
  }

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Teams</PageHeader>
      <DynamicTable
        caption={`${resources.length} people`}
        head={head}
        rows={rows(resources)}
        rowsPerPage={20}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="name"
        defaultSortOrder="ASC"
      />
    </Layout>
  );
}

Resources.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Resources);
