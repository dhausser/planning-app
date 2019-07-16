import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { colors } from '@atlaskit/theme';
import ChevD from '@atlaskit/icon/glyph/chevron-down';
import {
  ContainerHeader,
  ItemAvatar,
  Switcher,
  NavigationProvider,
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

const TOGGLE_FILTER = gql`
  mutation toggleFilter($value: ID!, $label: String!, $__typename: String!) {
    toggleFilter(value: $value, label: $label, __typename: $__typename) @client
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
    before={s => <ItemAvatar appearance="square" itemState={s} src={avatar} />}
    after={ChevD}
    id={id}
    subText={subText}
    text={text}
  />
);

const Wrapper = props => (
  <div
    css={{
      backgroundColor: colors.N20,
      boxSizing: 'border-box',
      padding: '16px',
    }}
    {...props}
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
      const relevant = [];
      const garbage = [];

      data.projects.forEach((project) => {
        const option = {
          avatar: project.avatarUrls.large,
          id: project.id,
          pathname: `/projects/${project.key}`,
          text: project.name,
          subText: `${project.projectTypeKey} project`,
        };

        if (['10500', '16000', '16001'].includes(project.id)) {
          relevant.push(option);
        } else {
          garbage.push(option);
        }
      });

      const projects = [
        {
          label: 'Recent Projects',
          options: relevant,
        },
        {
          label: 'Other Projects',
          options: garbage,
        },
      ];

      const current = filter && [...relevant, ...garbage].find(({ id }) => id === filter.id);

      setOptions(projects);
      setSelected(current || projects[0].options[0]);
    }
  }, [data.projects, error, filter, loading]);

  if (loading) return <div />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <NavigationProvider>
      <Wrapper>
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
      </Wrapper>
    </NavigationProvider>
  );
}

target.propTypes = {
  id: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};

export default ProjectSwitcher;
