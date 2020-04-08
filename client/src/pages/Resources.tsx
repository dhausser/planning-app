import React, { useState, useEffect, FunctionComponent } from 'react';
import { useQuery, gql } from '@apollo/client';
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

const GET_RESOURCES = gql`
  query GetResources($teamId: String) {
    teamId @client @export(as: "teamId")
    resources(teamId: $teamId) {
      key
      name
      team
      position
      email
    }
  }
`;

const Wrapper = styled.div`
  min-width: 600px;
`;

const Resources: FunctionComponent<Props> = ({ navigationViewController }) => {
  const [isProfileCardView, setIsProfileCardView] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_RESOURCES);

  useEffect(() => navigationViewController.setView(projectHomeView.id), [
    navigationViewController,
  ]);

  let resources: Resource[] = [];
  if (!loading) {
    resources = data.teamId
      ? data.resources.filter(({ team }: Resource) => team === data.teamId)
      : data.resources;
  }
  if (error)
    return <EmptyState header={error.name} description={error.message} />;

  let display;
  if (isProfileCardView) {
    display = <ProfileGrid resources={resources} />;
  } else {
    display = (
      <ResourceTable
        resources={resources}
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
          {isEditOpen && <EditResourceModal setIsOpen={setIsEditOpen} />}
          {isDeleteOpen && <DeleteResourceModal setIsOpen={setIsDeleteOpen} />}
        </ModalTransition>
      </Wrapper>
    </Layout>
  );
};

export default withNavigationViewController(Resources);
