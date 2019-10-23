/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import styled from 'styled-components';

import { withNavigationViewController } from '@atlaskit/navigation-next';
import DynamicTable from '@atlaskit/dynamic-table';
import Avatar from '@atlaskit/avatar';
import EmptyState from '@atlaskit/empty-state';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import Button, { ButtonGroup } from '@atlaskit/button';
import ModalDialog, { ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import Select from '@atlaskit/select';

import { TeamFilter, ProjectHomeView, Layout } from '../components';

const GET_TEAM_FILTER = gql`
  {
    teamId @client
  }
`;

const GET_RESOURCES = gql`
  query GetResources($teamId: String) {
    teamId @client @export(as: "teamId")
    resources(teamId: $teamId) {
      key
      name
      team
    }
  }
`;

const GET_TEAMS = gql`
  query GetTeams {
    teams {
      id
    }
  }
`;

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <TeamFilter />
  </div>
);

function createKey(input) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

const head = {
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
    },
    {
      key: 'team',
      content: 'Team',
      isSortable: true,
      width: 15,
    },
    {
      key: 'actions',
      content: 'Actions',
      width: 15,
    },
  ],
};

const rows = (resources, setIsEditOpen, setIsDeleteOpen) => resources.map((resource) => ({
  key: resource.key,
  cells: [
    {
      key: createKey(resource.name),
      content: (
        <NameWrapper>
          <Avatar
            name={resource.name}
            size="medium"
            src={`https://${
              process.env.REACT_APP_HOST}/secure/useravatar?ownerId=${
              resource.key
            }`}
          />
          <Link to={`/resource/${resource.key}`}>{resource.name}</Link>
        </NameWrapper>
      ),
    },
    {
      key: createKey(resource.team),
      content: resource.team,
    },
    {
      key: 'actions',
      content: (
        <ButtonGroup>
          <Button appearance="primary" onClick={() => setIsEditOpen(true)}>Edit</Button>
          <Button appearance="subtle" onClick={() => setIsDeleteOpen(true)}>Delete</Button>
        </ButtonGroup>
      ),
    },
  ],
}));

const onFormSubmit = (data) => console.log(JSON.stringify(data));

function Resources({ navigationViewController }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);

  const { data: { teamId } } = useQuery(GET_TEAM_FILTER);
  const { data, loading, error } = useQuery(GET_RESOURCES);
  const { data: teamData } = useQuery(GET_TEAMS);

  let resources = [];
  if (error) return <EmptyState header={error.name} description={error.message} />;
  if (!loading) {
    resources = teamId
      ? data.resources.filter((resource) => resource.team === teamId)
      : data.resources;
  }

  const options = teamData
    && teamData.teams
    && teamData.teams.map(({ id }) => ({ value: id, label: id }));

  console.log({ options });

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Teams</PageHeader>
      <ButtonGroup>
        <Button appearance="primary" onClick={() => setIsCreateOpen(true)}>Create</Button>
      </ButtonGroup>
      <DynamicTable
        caption={`${resources.length} people`}
        head={head}
        rows={rows(resources, setIsEditOpen, setIsDeleteOpen)}
        rowsPerPage={20}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="name"
        defaultSortOrder="ASC"
      />
      <ModalTransition>
        {isCreateOpen
          && (
          <ModalDialog
            heading="Create"
            onClose={() => setIsCreateOpen(false)}
            components={{
              Container: ({ children, className }) => (
                <Form onSubmit={onFormSubmit}>
                  {({ formProps }) => (
                    <form {...formProps} className={className}>
                      {children}
                    </form>
                  )}
                </Form>
              ),
              Footer: () => (
                <ModalFooter>
                  <span />
                  <ButtonGroup>
                    <Button appearance="primary" type="submit">Submit</Button>
                    <Button appearance="default" type="close" onClick={() => setIsCreateOpen(false)}>Close</Button>
                  </ButtonGroup>
                </ModalFooter>
              ),
            }}
          >
            <Field label="Firstname" name="firstname" defaultValue="">
              {({ fieldProps }) => (
                <Textfield placeholder="Gerald" {...fieldProps} />
              )}
            </Field>
            <Field label="Lastname" name="lastname" defaultValue="">
              {({ fieldProps }) => (
                <Textfield placeholder="Of Rivia" {...fieldProps} />
              )}
            </Field>
            <Field label="Email" name="email" defaultValue="">
              {({ fieldProps }) => (
                <Textfield
                  placeholder="gerald@cdprojektred.com"
                  {...fieldProps}
                />
              )}
            </Field>
            <Field label="Team" name="team" defaultValue="">
              {({ fieldProps }) => (
                <Select options={options} placeholder="Team" {...fieldProps} />
              )}
            </Field>
          </ModalDialog>
          )}
        {isEditOpen && <ModalDialog heading="Edit" onClose={() => setIsEditOpen(false)} />}
        {isDeleteOpen && <ModalDialog heading="Delete" onClose={() => setIsDeleteOpen(false)} />}
      </ModalTransition>
    </Layout>
  );
}

Resources.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Resources);
