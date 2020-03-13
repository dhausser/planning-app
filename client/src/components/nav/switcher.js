import React, { useState, useEffect } from 'react';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import ChevD from '@atlaskit/icon/glyph/chevron-down';
import { ContainerHeader, ItemAvatar, Switcher } from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';
import { updateFilter } from '../filters/project-filter';

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
    const boardName = window.prompt('What would you like to call your new board?');
    if (boardName && boardName.length) {
      console.log(`You created the board "${boardName}"`);
    }
  },
  text: 'Create board',
});

const target = ({
  id, subText, text, avatar,
}) => (
  <ContainerHeader
    before={(s) => (
      <ItemAvatar
        appearance="square"
        itemState={s}
        size="large"
        src={avatar}
      />
    )}
    after={ChevD}
    id={id}
    subText={subText}
    text={text}
  />
);

function ProjectSwitcher() {
  const client = useApolloClient();
  const { data, loading, error } = useQuery(GET_PROJECTS);
  const [selected, setSelected] = useState({});
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!loading && !error) {
      const projects = [
        {
          label: 'Recent Projects',
          options: [],
        },
      ];

      data.projects.forEach((project) => {
        projects[0].options.push({
          avatar: project.avatarUrls.large,
          id: project.id,
          pathname: `/projects/${project.key}`,
          text: project.name,
          subText: `${project.projectTypeKey} project`,
        });
      });

      const current = data.projectId && projects[0].options.find(({ id }) => id === data.projectId);

      setOptions(projects);
      setSelected(current || projects[0].options[0]);
    }
  }, [data, error, data.projectId, loading]);

  if (loading) return <div />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Switcher
      create={create()}
      onChange={({ id, text }) => {
        updateFilter(client, id);
        setSelected({ id, text });
      }}
      options={options}
      target={target(selected)}
      value={selected}
    />
  );
}

target.propTypes = {
  id: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};

export default ProjectSwitcher;
