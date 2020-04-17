import React, { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ProfileCard } from '@atlaskit/profilecard';
import { ModalProps } from '../../types';

const Container = styled.div`
  padding-top: 20px;
  padding-bottom: 60px;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

function ProfileGrid({
  resources,
  setSelection,
  setIsEditOpen,
  setIsDeleteOpen,
}: ModalProps): ReactElement {
  const history = useHistory();
  const today = new Date();
  const time = `${today.getHours()}:${today.getMinutes()}`;
  return (
    <Container>
      <CardGrid>
        {resources.map((resource) => (
          <div key={resource.key} style={{ margin: '0 20px 20px 0' }}>
            <ProfileCard
              // avatarUrl={resource?.avatarUrls?.large}
              avatarUrl={`https://jira.cdprojektred.com/secure/useravatar?size=large&ownerId=${resource.key}`}
              fullName={resource.name}
              // meta={`${resource.position} in ${resource.team || 'Team'}`}
              email={resource.email}
              timestring={time}
              location="Warsaw"
              actions={[
                {
                  label: 'View',
                  id: 'view-profile',
                  callback: (): void =>
                    history.push(`/resource/${resource.key}`),
                },
                {
                  label: 'Update',
                  id: 'update-profile',
                  callback: (): void => {
                    setSelection(resource);
                    setIsEditOpen(true);
                  },
                },
                {
                  label: 'Delete',
                  id: 'delete-profile',
                  callback: (): void => {
                    setSelection(resource);
                    setIsDeleteOpen(true);
                  },
                },
              ]}
            />
          </div>
        ))}
      </CardGrid>
    </Container>
  );
}

export default ProfileGrid;
