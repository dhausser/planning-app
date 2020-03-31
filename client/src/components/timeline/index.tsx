import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Headline from './headline';
import Chart from './chart';
import data from './sample.json';
import { MockIssue } from './../../types';

// import { useQuery, gql } from '@apollo/client';
// import { ScrollSync } from 'react-scroll-sync';
// import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
// import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
// import EmptyState from '@atlaskit/empty-state';
// import { Loading } from '..';

const { issues, months }: { issues: MockIssue[]; months: Array<string> } = data;

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

// function createEpic() {
// const { length } = issues;
// const num = length + 1;
// const issue = {
//   id: `${num}`,
//   key: `ST-${num}`,
//   fields: {
//     summary: `Epic Number ${num}`,
//   },
// };
// setIssues([...issues, issue]);
// }

const Timeline: FunctionComponent = () => {
  // const { loading, error, data } = useQuery(GET_EPICS);

  // if (loading || !data) return <Loading />;
  // if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Container>
      <Wrapper>
        <Headline issues={issues} />
        <Chart issues={issues} months={months} />
      </Wrapper>
    </Container>
  );
};

export default Timeline;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Container = styled.div`
  position: relative;
  margin-top: 8px;
  flex: 1 1 auto;
`;

const Wrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;
