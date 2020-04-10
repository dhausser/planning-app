import React, { useState, useEffect, FunctionComponent } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import Button, { ButtonGroup } from '@atlaskit/button';
import { ModalTransition } from '@atlaskit/modal-dialog';
import EmptyState from '@atlaskit/empty-state';
import { projectHomeView, Layout } from '../components';
import {
  ProfileGrid,
  ResourceTable,
  CreateResourceModal,
  EditResourceModal,
  DeleteResourceModal,
  bottomBar,
} from '../components/Resource';
import { Props, Resource } from '../types';
import { ROWS_PER_PAGE } from '../lib/useIssues';
import { GET_RESOURCES } from '../lib/useResources';

const Wrapper = styled.div`
  min-width: 600px;
`;

const Resources: FunctionComponent<Props> = ({ navigationViewController }) => {
  const [selection, setSelection] = useState();
  const [isProfileCardView, setIsProfileCardView] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_RESOURCES);

  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);

  let resources: Resource[] = [];
  if (error)
    return <EmptyState header={error.name} description={error.message} />;
  if (!loading && data) {
    resources = data?.teamId
      ? data.resources.filter(({ team }: Resource) => team === data.teamId)
      : data.resources;
  }

  let display;
  if (isProfileCardView) {
    display = (
      <ProfileGrid
        resources={resources}
        setSelection={setSelection}
        setIsEditOpen={setIsEditOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />
    );
  } else {
    display = (
      <ResourceTable
        resources={resources}
        setSelection={setSelection}
        setIsEditOpen={setIsEditOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        loading={loading}
        rowsPerPage={ROWS_PER_PAGE}
      />
    );
  }

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
          <Button
            appearance="subtle"
            onClick={(): void => setIsProfileCardView(!isProfileCardView)}
          >
            Switch Display
          </Button>
        </ButtonGroup>
        {display}
        <ModalTransition>
          {isCreateOpen && <CreateResourceModal setIsOpen={setIsCreateOpen} />}
          {isEditOpen && (
            <EditResourceModal
              selection={selection}
              setIsOpen={setIsEditOpen}
            />
          )}
          {isDeleteOpen && (
            <DeleteResourceModal
              selection={selection}
              setIsOpen={setIsDeleteOpen}
            />
          )}
        </ModalTransition>
      </Wrapper>
    </Layout>
  );
};

export default withNavigationViewController(Resources);
