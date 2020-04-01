import React, { useState, useEffect, FunctionComponent } from 'react';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import DynamicTable from '@atlaskit/dynamic-table';
import PageHeader from '@atlaskit/page-header';
import Button, { ButtonGroup } from '@atlaskit/button';
import { ModalTransition } from '@atlaskit/modal-dialog';
import EmptyState from '@atlaskit/empty-state';
import { projectHomeView, Layout } from '../components';
import {
  CreateResourceModal,
  EditResourceModal,
  DeleteResourceModal,
  bottomBar,
  head,
  rows,
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

const Wrapper = styled.div`
  min-width: 600px;
`;

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
      <PageHeader bottomBar={bottomBar}>Teams</PageHeader>
      <Wrapper>
        <ButtonGroup>
          <Button
            appearance="primary"
            onClick={(): void => setIsCreateOpen(true)}
          >
            Create
          </Button>
        </ButtonGroup>
        <DynamicTable
          caption={`${resources.length} people`}
          head={head}
          rows={rows(resources, setIsEditOpen, setIsDeleteOpen)}
          rowsPerPage={10}
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
      </Wrapper>
    </Layout>
  );
};

export default withNavigationViewController(Resources);
