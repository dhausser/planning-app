import React, { useEffect, FunctionComponent, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import styled from 'styled-components';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import DynamicTable from '@atlaskit/dynamic-table';
import EmptyState from '@atlaskit/empty-state';
import Avatar from '@atlaskit/avatar';

import { RowType } from '@atlaskit/dynamic-table/dist/cjs/types';
import { Props, FilterLinkProps, Project } from '../types';
import { productHomeView, Layout } from '../components';
import { updateFilter } from '../components/Filters/ProjectFilter';
import useProjects from '../lib/useProjects';

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

function FilterLink({ children, id, name }: FilterLinkProps): ReactElement {
  const client = useApolloClient();
  const value = id;
  const label = name;
  return (
    <Link
      to="/roadmap"
      onClick={(): void => updateFilter(client, { value, label })}
    >
      {children}
    </Link>
  );
}

const row = (project: Project): RowType => ({
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
});

const getRows = (projects: Project[]): RowType[] =>
  projects.map((project) => row(project));

const Projects: FunctionComponent<Props> = ({ navigationViewController }) => {
  useEffect(() => navigationViewController.setView(productHomeView.id), [
    navigationViewController,
  ]);
  const { loading, error, data } = useProjects();

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
        rows={data?.projects && getRows(data?.projects)}
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
