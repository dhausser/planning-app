/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import ChevD from '@atlaskit/icon/glyph/chevron-down';
import {
  ContainerHeader,
  ItemAvatar,
  Switcher,
} from '@atlaskit/navigation-next';
import { updateFilter } from '../Filters/ProjectFilter';
import useProjects from '../../useProjects';

const create = () => ({
  onClick: () => {
    // eslint-disable-next-line
    const boardName = window.prompt(
      'What would you like to call your new board?'
    );
    if (boardName && boardName.length) {
      // eslint-disable-next-line
      console.log(`You created the board "${boardName}"`);
    }
  },
  text: 'Create board',
});

const target = ({ id, subText, text, avatar: avatarUrl }) => {
  const avatar = (s) => (
    <ItemAvatar
      appearance="square"
      src={avatarUrl}
      isInteractive={false}
      itemState={s}
    />
  );

  return (
    <ContainerHeader
      before={avatar}
      after={ChevD}
      id={id}
      subText={subText}
      text={text}
    />
  );
};

const projectReducer = ({ projects, projectId, setSelected }) => {
  return (
    projects &&
    projects.map((project) => {
      const value = {
        avatar: project.avatarUrls.large,
        id: project.id,
        pathname: `/projects/${project.key}`,
        text: project.name,
        subText: `${project.projectTypeKey} project`,
      };

      if (projectId && projectId === project.id) {
        setSelected(value);
      }

      return value;
    })
  );
};

export default function MySwitcher() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState({});
  const client = useApolloClient();
  const { loading, error, data } = useProjects();

  useEffect(() => {
    if (!loading && !error && data && data.projects) {
      const options = projectReducer({
        projects: data.projects,
        projectId: data.projectId,
        setSelected,
      });
      setProjects(options);
    }
  }, [loading, error, data]);

  return (
    <Switcher
      create={create()}
      onChange={(e) => {
        updateFilter(client, { value: e.id, label: e.text });
        setSelected(e);
      }}
      options={projects}
      target={target(selected)}
      value={selected}
    />
  );
}
