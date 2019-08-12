import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import ChevD from '@atlaskit/icon/glyph/chevron-down';
import {
  ContainerHeader,
  ItemAvatar,
  Switcher,
} from '@atlaskit/navigation-next';
import EmptyState from '@atlaskit/empty-state';

import { TOGGLE_FILTER } from '../Filters';

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

const GET_FILTER = gql`
  query GetFilter {
    filter @client {
      project @client {
        id
        name
      }
    }
  }
`;

const create = () => ({
  onClick: () => {
    // eslint-disable-next-line
    const boardName = window.prompt(
      'What would you like to call your new board?',
    );
    if (boardName && boardName.length) {
      // eslint-disable-next-line
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
  const [selected, setSelected] = useState({});
  const [options, setOptions] = useState([]);
  const [toggleFilter] = useMutation(TOGGLE_FILTER);
  const { data: { filter: { project: filter } } } = useQuery(GET_FILTER);

  const { data, loading, error } = useQuery(GET_PROJECTS, {
    fetchPolicy: 'cache-first',
  });

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

      const current = filter && projects[0].options.find(({ id }) => id === filter.id);

      setOptions(projects);
      setSelected(current || projects[0].options[0]);
    }
  }, [data.projects, error, filter, loading]);

  if (loading) return <div />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Switcher
      create={create()}
      onChange={(e) => {
        toggleFilter({
          variables: {
            value: e.id,
            label: e.text,
            __typename: 'Project',
          },
        });
        setSelected(e);
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
