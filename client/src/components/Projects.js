import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import Avatar from '@atlaskit/avatar';
import DynamicTable from '@atlaskit/dynamic-table';
import EmptyState from '@atlaskit/empty-state';
import PageHeader from '@atlaskit/page-header';
import { ProductHomeView, Layout } from '.';

const PROJECT_TILE_DATA = gql`
  fragment ProjectTile on Project {
    id
    key
    name
    projectTypeKey
  }
`;

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      ...ProjectTile
      avatarUrls {
        small
      }
    }
  }
  ${PROJECT_TILE_DATA}
`;

const TOGGLE_FILTER = gql`
  mutation toggleFilter($value: ID!, $label: String!, $__typename: String!) {
    toggleFilter(value: $value, label: $label, __typename: $__typename) @client
  }
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

const head = {
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
      width: 30,
    },
    {
      key: 'key',
      content: 'Key',
      isSortable: true,
    },
    {
      key: 'type',
      content: 'Type',
    },
  ],
};

const row = (project, toggleFilter) => ({
  key: project.id,
  cells: [
    {
      key: project.name,
      content: (
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={project.name}
              size="small"
              appearance="square"
              src={project.id === '10500'
                ? 'https://solarsystem.atlassian.net/secure/projectavatar?pid=10000&avatarId=10011&size=xxlarge'
                : project.avatarUrls.small
              }
            />
          </AvatarWrapper>
          <Link
            to={`/roadmap/${project.key}`}
            onClick={() => {
              const { id, name, __typename } = project;
              toggleFilter({ variables: { value: id, label: name, __typename } });
            }}
          >
            {project.name}
          </Link>
        </NameWrapper>
      ),
    },
    {
      key: project.key,
      content: project.key,
    },
    {
      key: project.projectTypeKey,
      content: project.projectTypeKey,
    },
  ],
});

function Projects({ navigationViewController }) {
  useEffect(() => navigationViewController.setView(ProductHomeView.id), [navigationViewController]);
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    fetchPolicy: 'cache-first',
  });
  const [toggleFilter] = useMutation(TOGGLE_FILTER);

  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Layout>
      <PageHeader>Projects</PageHeader>
      <DynamicTable
        caption={`Displaying ${(!loading && data.projects.length) || 0} projects`}
        head={head}
        rows={!loading
          && data.projects.length
          && data.projects.map(project => row(project, toggleFilter))}
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

Projects.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Projects);
