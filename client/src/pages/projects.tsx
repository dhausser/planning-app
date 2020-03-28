import React, { useEffect, FunctionComponent } from 'react';
import { Link } from '@reach/router';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import DynamicTable from '@atlaskit/dynamic-table';
import EmptyState from '@atlaskit/empty-state';
import Avatar from '@atlaskit/avatar';
import { productHomeView, Layout } from '../components';
import { updateFilter } from '../components/filters/project-filter';
import { Props, FilterLinkProps, Project } from '../types';

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

function FilterLink({ children, id, name }: FilterLinkProps) {
  const client = useApolloClient();
  const value = id;
  const label = name;
  return (
    <Link to="/roadmap" onClick={() => updateFilter(client, { value, label })}>
      {children}
    </Link>
  );
}

function createRow(project: Project) {
  return {
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
            <FilterLink id={project.id} name={project.name}>
              {project.name}
            </FilterLink>
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
  };
}

const Projects: FunctionComponent<Props> = ({ navigationViewController }) => {
  useEffect(() => navigationViewController.setView(productHomeView.id), [
    navigationViewController,
  ]);
  const { data, loading, error } = useQuery(GET_PROJECTS);

  if (error)
    return <EmptyState header={error.name} description={error.message} />;

  return (
    <Layout>
      <PageHeader>Projects</PageHeader>
      <DynamicTable
        caption={
          data && `Displaying ${data.projects && data.projects.length} projects`
        }
        head={head}
        rows={data && data.projects && data.projects.map(createRow)}
        rowsPerPage={20}
        loadingSpinnerSize="small"
        isLoading={loading}
        isFixedSize
        defaultSortKey="name"
        defaultSortOrder="ASC"
      />
    </Layout>
  );
};

export default withNavigationViewController(Projects);
