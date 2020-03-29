import React, { useState, useEffect } from 'react';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import ChevD from '@atlaskit/icon/glyph/chevron-down';
import {
  ContainerHeader,
  ItemAvatar,
  Switcher,
} from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';
import { updateFilter } from '../filters/project-filter';
import { Project, ProjectListItem } from '../../types';

export const PROJECT_TILE_DATA = gql`
  fragment ProjectTile on Project {
    id
    key
    name
    projectTypeKey
  }
`;

const GET_SWITCHER_PROJECTS = gql`
  query GetSwitcherProjects {
    projectId @client
    projects {
      ...ProjectTile
      avatarUrls {
        large
      }
    }
  }
  ${PROJECT_TILE_DATA}
`;

const create = () => ({
  onClick: () => {
    // eslint-disable-next-line no-alert
    const boardName = window.prompt(
      'What would you like to call your new board?',
    );
    if (boardName && boardName.length) {
      console.log(`You created the board "${boardName}"`);
    }
  },
  text: 'Create board',
});

const target = ({ id, subText, text, avatar }: ProjectListItem) => (
  <ContainerHeader
    before={() => <ItemAvatar appearance="square" size="large" src={avatar} />}
    after={ChevD}
    id={id}
    subText={subText}
    text={text}
  />
);

function ProjectSwitcher() {
  const [selected, setSelected] = useState<ProjectListItem>();
  const [options, setOptions] = useState<ProjectListItem[]>();
  const client = useApolloClient();
  const { data, loading, error } = useQuery<{
    projects: Project[];
    projectId: string;
  }>(GET_SWITCHER_PROJECTS);

  useEffect(() => {
    if (!loading && !error) {
      const options: ProjectListItem[] = [];

      if (data) {
        data.projects.forEach((project) => {
          const item: ProjectListItem = {
            avatar: project.avatarUrls.large,
            id: project.id,
            pathname: `/projects/${project.key}`,
            text: project.name,
            subText: `${project.projectTypeKey} project`,
          };
          options.push(item);
        });

        const current =
          data.projectId && options.find(({ id }) => id === data.projectId);
        setSelected(current || options[0]);
        setOptions(options);
      }
    }
  }, [data, error, data?.projectId, loading]);

  if (loading) return <div />;
  if (error)
    return <EmptyState header={error.name} description={error.message} />;

  return (
    <Switcher
      create={create()}
      onChange={(option: ProjectListItem) => {
        updateFilter(client, { value: option.id, label: option.text });
        setSelected(option);
      }}
      options={options}
      target={selected && target(selected)}
      value={selected}
    />
  );
}

export default ProjectSwitcher;
