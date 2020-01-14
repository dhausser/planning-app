import React, { useState, useEffect } from 'react';

import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import PropTypes from 'prop-types';
import ChevD from '@atlaskit/icon/glyph/chevron-down';
import {
  ContainerHeader,
  ItemAvatar,
  Switcher,
} from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';

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
        large
      }
    }
  }
  ${PROJECT_TILE_DATA}
`;

const GET_PROJECT_FILTER = gql`
  {
    projectId @client
  }
`;

const create = () => ({
  onClick: () => {
    const boardName = window.prompt(
      'What would you like to call your new board?',
    );
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
        src={id === '10500'
          ? 'https://solarsystem.atlassian.net/secure/projectavatar?pid=10000&avatarId=10011&size=xxlarge'
          : avatar}
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
  const { data: { projectId } } = useQuery(GET_PROJECT_FILTER);
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

      const current = projectId && projects[0].options.find(({ id }) => id === projectId);

      setOptions(projects);
      setSelected(current || projects[0].options[0]);
    }
  }, [data, error, projectId, loading]);

  if (loading) return <div />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Switcher
      create={create()}
      onChange={({ id, text }) => {
        client.writeData({ data: { projectId: id } });
        localStorage.setItem('projectId', id);
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
