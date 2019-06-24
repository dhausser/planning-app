import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Avatar from '@atlaskit/avatar';
import DynamicTable from '@atlaskit/dynamic-table';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import {
  ProductHomeView, Page, Loading, Error,
} from '../components';
import { NameWrapper, AvatarWrapper } from '../components/Page';
import { PROJECT_TILE_DATA } from '../queries';

export const GET_PROJECTS = gql`
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

const row = project => ({
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
              src={project.avatarUrls.small}
            />
          </AvatarWrapper>
          <Link to={`/resources/${project.key}`}>{project.name}</Link>
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
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id);
  }, [navigationViewController]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <Page>
      <h1>Projects</h1>
      <DynamicTable
        caption={`Displaying ${data.projects.length} projects`}
        head={head}
        rows={!loading && data.projects.length && data.projects.map(row)}
        rowsPerPage={20}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="name"
        defaultSortOrder="ASC"
      />
    </Page>
  );
}

Projects.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Projects);
