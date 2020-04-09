import React, { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ProfileCard } from '@atlaskit/profilecard';
import { Resource } from '../../types';

const Container = styled.div`
  /* width: 95%; */
  /* max-width: 600px; */
  /* margin: 0 auto; */
  padding-top: 20px;
  padding-bottom: 60px;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

interface Props {
  resources: Resource[];
}

function ProfileGrid({ resources }: Props): ReactElement {
  const history = useHistory();
  const today = new Date();
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  return (
    <Container>
      <CardGrid>
        {resources.map((resource) => (
          <div key={resource.key} style={{ margin: '0 20px 20px 0' }}>
            <ProfileCard
              avatarUrl={`https://jira.cdprojektred.com/secure/useravatar?size=large&ownerId=${resource.key}`}
              fullName={resource.name}
              meta={resource.position}
              nickname={resource.key}
              email={resource.email}
              timestring={time}
              location="Warsaw"
              actions={[
                {
                  label: 'View profile',
                  id: 'view-profile',
                  callback: (): void =>
                    history.push(`/resource/${resource.key}`),
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
