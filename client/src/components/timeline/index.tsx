import React from 'react';
// import { useQuery, gql } from '@apollo/client';
import { ScrollSync } from 'react-scroll-sync';
import styled from 'styled-components';
// import EmptyState from '@atlaskit/empty-state';
// import { Loading } from '..';
import Calendar from './calendar';
import Headline from './headline';

import data from './sample.json';

// const GET_EPICS = gql`
//   query issueList($projectId: String, $versionId: String) {
//     projectId @client @export(as: "projectId")
//     versionId @client @export(as: "versionId")
//     epics(projectId: $projectId, versionId: $versionId) {
//       id
//       key
//       fields {
//         summary
//       }
//     }
//   }
// `;

export default function Timeline() {
  // const { loading, error, data } = useQuery(GET_EPICS);

  // if (loading || !data) return <Loading />;
  // if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Wrapper>
      <ScrollSync>
        <ScrollWrapper>
          <Headline issues={data.epics} />
          <Calendar issues={data.epics} />
        </ScrollWrapper>
      </ScrollSync>
    </Wrapper>
  );
}

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Wrapper = styled.div`
  position: relative;
  margin-top: 8px;
  flex: 1 1 auto;
`;

const ScrollWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;
