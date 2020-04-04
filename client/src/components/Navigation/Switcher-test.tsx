import React, {
  useState,
  useEffect,
  FunctionComponent,
  ReactElement,
} from 'react';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import ChevD from '@atlaskit/icon/glyph/chevron-down';
import {
  ContainerHeader,
  ItemAvatar,
  Switcher,
} from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';
import { updateFilter } from '../Filters/ProjectFilter';
import { Project, ProjectListItem } from '../../types';

import projects from './data';

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

const create = (): object => ({
  onClick: (): void => {
    // eslint-disable-next-line no-alert
    const boardName = window.prompt(
      'What would you like to call your new board?'
    );
    if (boardName && boardName.length) {
      // eslint-disable-next-line no-console
      console.log(`You created the board "${boardName}"`);
    }
  },
  text: 'Create board',
});

const target = ({
  id,
  subText,
  text,
  avatar,
}: ProjectListItem): ReactElement => (
  <ContainerHeader
    before={(): ReactElement => (
      <ItemAvatar appearance="square" size="large" src={avatar} />
    )}
    after={ChevD}
    id={id}
    subText={subText}
    text={text}
  />
);

const ProjectSwitcher: FunctionComponent = () => {
  const [selected, setSelected] = useState<ProjectListItem>(projects[0]);
  const [options, setOptions] = useState<ProjectListItem[]>(projects);
  const client = useApolloClient();
  const { data, loading, error } = useQuery<{
    projects: Project[];
    projectId: string;
  }>(GET_SWITCHER_PROJECTS);

  useEffect(() => {
    if (!loading && !error) {
      const projectOptions: ProjectListItem[] = [];

      if (data) {
        data.projects.forEach((project) => {
          const item: ProjectListItem = {
            avatar: project.avatarUrls.large,
            id: project.id,
            pathname: `/projects/${project.key}`,
            text: project.name,
            subText: `${project.projectTypeKey} project`,
          };
          projectOptions.push(item);
        });

        const current =
          data.projectId &&
          projectOptions.find(({ id }) => id === data.projectId);
        setSelected(current || projectOptions[0]);
        setOptions(projectOptions);
      }
    }
  }, [data, error, loading]);

  if (loading) return <div />;
  if (error)
    return <EmptyState header={error.name} description={error.message} />;

  return (
    <Switcher
      create={create()}
      onChange={(option: ProjectListItem): void => {
        updateFilter(client, { value: option.id, label: option.text });
        setSelected(option);
      }}
      options={options}
      target={selected && target(selected)}
      value={selected}
    />
  );
};

export default ProjectSwitcher;
