import React, { useState, useEffect, FunctionComponent } from 'react';
import { useQuery, gql } from '@apollo/client';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import DynamicTable from '@atlaskit/dynamic-table';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import Button, { ButtonGroup } from '@atlaskit/button';
import { ModalTransition } from '@atlaskit/modal-dialog';
import EmptyState from '@atlaskit/empty-state';
import { TeamFilter, projectHomeView, Layout } from '../components';
import {
  CreateResourceModal,
  EditResourceModal,
  DeleteResourceModal,
  TableRow,
} from '../components/resource';
import { Props, Resource } from '../types';

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

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <TeamFilter />
  </div>
);

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

const Resources: FunctionComponent<Props> = ({ navigationViewController }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_RESOURCES);

  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);

  let resources: Array<Resource> = [];
  if (!loading) {
    resources = data.teamId
      ? data.resources.filter(({ team }: Resource) => team === data.teamId)
      : data.resources;
  }
  if (error)
    return <EmptyState header={error.name} description={error.message} />;

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>Teams</PageHeader>
      <ButtonGroup>
        <Button appearance="primary" onClick={() => setIsCreateOpen(true)}>
          Create
        </Button>
      </ButtonGroup>
      <DynamicTable
        caption={`${resources.length} people`}
        head={head}
        rows={TableRow(resources, setIsEditOpen, setIsDeleteOpen)}
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
};

export default withNavigationViewController(Resources);
