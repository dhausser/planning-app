/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
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

const CREATE_RESOURCE = gql`
  mutation CreateResource($id: ID!, $firstname: String!, $lastname: String!, $email: String!, $team: String!) {
    createResource(id: $id, firstname: $firstname, lastname: $lastname, email: $email, team: $team) {
      key
    }
  }
`;

const UPDATE_RESOURCE = gql`
  mutation UpdateResource($id: ID!, $firstname: String!, $lastname: String!, $email: String!, $team: String!) {
    updateResource(id: $id, firstname: $firstname, lastname: $lastname, email: $email, team: $team) {
      key
    }
  }
`;

const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id) {
      key
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
          <Button appearance="default" onClick={() => setIsEditOpen(true)}>Edit</Button>
          <Button appearance="default" onClick={() => setIsDeleteOpen(true)}>Delete</Button>
        </ButtonGroup>
      ),
    },
  ],
}));

const footer = (setIsOpen) => (
  <ModalFooter>
    <span />
    <ButtonGroup>
      <Button appearance="default" type="close" onClick={() => setIsOpen(false)}>Close</Button>
      <Button appearance="primary" type="submit">Submit</Button>
    </ButtonGroup>
  </ModalFooter>
);

function CreateResourceModal({ setIsOpen }) {
  const [createResource] = useMutation(CREATE_RESOURCE, {
    onCompleted: ({ key }) => { console.log(`Successfully created resource: ${key}`); },
  });
  const { data } = useQuery(GET_TEAMS);
  const options = data && data.teams && data.teams.map(({ id }) => ({ label: id, value: id }));

  return (
    <ModalDialog
      heading="Create"
      onClose={() => setIsOpen(false)}
      components={{
        Container: ({ children, className }) => (
          <Form onSubmit={(formData) => {
            console.log('form data', formData);
            const {
              firstname, lastname, email, team: { value },
            } = formData;
            const id = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
            createResource({
              variables: {
                id, firstname, lastname, email, team: value,
              },
            });
            setIsOpen(false);
          }}
          >
            {({ formProps }) => (
              <form {...formProps} className={className}>
                {children}
              </form>
            )}
          </Form>
        ),
        Footer: () => footer(setIsOpen),
      }}
    >
      <Field label="Firstname" name="firstname" defaultValue="" isRequired>
        {({ fieldProps }) => <TextField placeholder="Gerald" {...fieldProps} />}
      </Field>
      <Field label="Lastname" name="lastname" defaultValue="" isRequired>
        {({ fieldProps }) => <TextField placeholder="Of Rivia" {...fieldProps} />}
      </Field>
      <Field label="Email" name="email" defaultValue="" isRequired>
        {({ fieldProps }) => <TextField placeholder="gerald@cdprojektred.com" {...fieldProps} />}
      </Field>
      <Field label="Team" name="team" defaultValue="" isRequired>
        {({ fieldProps }) => <Select options={options} placeholder="Team" {...fieldProps} />}
      </Field>
    </ModalDialog>
  );
}

function EditResourceModal({ setIsOpen }) {
  const [updateResource] = useMutation(UPDATE_RESOURCE);
  const { data } = useQuery(GET_TEAMS);
  const options = data && data.teams && data.teams.map(({ id }) => ({ label: id, value: id }));

  return (
    <ModalDialog
      heading="Edit"
      onClose={() => setIsOpen(false)}
      components={{
        Container: ({ children, className }) => (
          <Form onSubmit={(formData) => {
            console.log('form data', formData);
            updateResource({ variables: { ...formData } });
            setIsOpen(false);
          }}
          >
            {({ formProps }) => (
              <form {...formProps} className={className}>
                {children}
              </form>
            )}
          </Form>
        ),
        Footer: () => footer(setIsOpen),
      }}
    >
      <Field label="Firstname" name="firstname" defaultValue="" isRequired>
        {({ fieldProps }) => <TextField placeholder="Gerald" {...fieldProps} />}
      </Field>
      <Field label="Lastname" name="lastname" defaultValue="" isRequired>
        {({ fieldProps }) => <TextField placeholder="Of Rivia" {...fieldProps} />}
      </Field>
      <Field label="Email" name="email" defaultValue="" isRequired>
        {({ fieldProps }) => <TextField placeholder="gerald@cdprojektred.com" {...fieldProps} />}
      </Field>
      <Field label="Team" name="team" defaultValue="" isRequired>
        {({ fieldProps }) => <Select options={options} placeholder="Team" {...fieldProps} />}
      </Field>
    </ModalDialog>
  );
}

function DeleteResourceModal({ setIsOpen }) {
  const [deleteResource] = useMutation(DELETE_RESOURCE);
  return (
    <ModalDialog
      heading="Delete"
      onClose={() => setIsOpen(false)}
      components={{
        Container: ({ children, className }) => (
          <Form onSubmit={(data) => {
            console.log('form data', data);
            deleteResource({ variables: { ...data } });
            setIsOpen(false);
          }}
          >
            {({ formProps }) => (
              <form {...formProps} className={className}>
                {children}
              </form>
            )}
          </Form>
        ),
        Footer: () => footer(setIsOpen),
      }}
    >
      <p>Are you sure want to delete this resource?</p>
      <Field label="Email" name="email" defaultValue="" isRequired>
        {({ fieldProps }) => <TextField placeholder="gerald@cdprojektred.com" {...fieldProps} />}
      </Field>
    </ModalDialog>
  );
}

function Resources({ navigationViewController }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => navigationViewController.setView(ProjectHomeView.id), [navigationViewController]);

  const { data: { teamId } } = useQuery(GET_TEAM_FILTER);
  const { data, loading, error } = useQuery(GET_RESOURCES);

  let resources = [];
  if (error) return <EmptyState header={error.name} description={error.message} />;
  if (!loading) {
    resources = teamId
      ? data.resources.filter((resource) => resource.team === teamId)
      : data.resources;
  }

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
        {isCreateOpen && <CreateResourceModal setIsOpen={setIsCreateOpen} />}
        {isEditOpen && <EditResourceModal setIsOpen={setIsEditOpen} />}
        {isDeleteOpen && <DeleteResourceModal setIsOpen={setIsDeleteOpen} />}
      </ModalTransition>
    </Layout>
  );
}

Resources.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Resources);
