import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Redirect, useParams } from 'react-router-dom';
import { ProfileCard } from '@atlaskit/profilecard';
import { Resource } from '../../types';

const Container = styled.div`
  width: 95%;
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 60px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-gap: 20px;
`;

interface Props {
  resources: Resource[];
}

function ProfileGrid({ resources }: Props): ReactElement {
  // const { history } = useParams();
  const today = new Date();
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  return (
    <Container>
      <CardGrid>
        {resources.map((resource) => (
          <ProfileCard
            key={resource.key}
            avatarUrl={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${resource.key}`}
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
                // eslint-disable-next-line react/display-name
                callback: (): void => {
                  // history.push(`/resource/${resource.key}`);
                  // <Redirect to={`/resource/${resource.key}`} />
                },
              },
            ]}
          />
        ))}
      </CardGrid>
    </Container>
  );
}

export default ProfileGrid;
