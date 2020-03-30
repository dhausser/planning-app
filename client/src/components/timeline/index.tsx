import React, { FC } from 'react';

// import { useQuery, gql } from '@apollo/client';
// import { ScrollSync } from 'react-scroll-sync';
// import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
// import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
// import EmptyState from '@atlaskit/empty-state';
// import { Loading } from '..';

import Headline from './headline';
import data from './sample.json';
import { MockIssue } from './../../types';

import {
  Container,
  Wrapper,
  Div1,
  Div2,
  Div20,
  Div21,
  Div22,
  Div23,
  Div24,
  Row,
  Draggable,
  BottomLine,
  Div3,
  Div30,
  Div31,
  Div320,
  Divider,
  Div321,
  StyledSvg,
  Div322,
  DayLineWrapper,
  DayLine,
} from './elements';

const { issues, months }: { issues: MockIssue[]; months: Array<string> } = data;
const WIDTH: number = 9579.5;
const MONTH_WIDTH: number = WIDTH / months.length / 100;
const daylineOffset: number = 320;

const left: number = 3;
const right: number = 95;

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

const Timeline: FC = () => {
  // const { loading, error, data } = useQuery(GET_EPICS);

  // if (loading || !data) return <Loading />;
  // if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Container>
      <Wrapper>
        <Headline issues={issues} />
        <Div1>
          <Div2>
            <Div20>
              <Div21>
                <Div22>
                  {months.map((month, i) => (
                    <Div23
                      key={month}
                      style={{
                        left: `calc(${i} * ${MONTH_WIDTH}%)`,
                        right: `calc(100% - ${MONTH_WIDTH}% * ${i + 1})`,
                      }}
                    >
                      <Div24>{month}</Div24>
                    </Div23>
                  ))}
                </Div22>
              </Div21>
            </Div20>
          </Div2>
          <Div3>
            <Div30 id="sr-timeline">
              <Div31 style={{ width: '9579.5px' }}>
                <Div320>
                  {months.map((month, i) => (
                    <Divider
                      key={month}
                      style={{
                        left: `calc(${i} * ${MONTH_WIDTH}%)`,
                        right: `calc(100% - ${MONTH_WIDTH}% * ${i + 1})`,
                      }}
                    />
                  ))}
                </Div320>
                <Div321>
                  <StyledSvg />
                </Div321>
                <Div322>
                  {issues.map((issue) => (
                    <Row key={issue.key}>
                      <Draggable
                        draggable="true"
                        style={{ left: `${left}%`, right: `${right}%` }}
                      />
                    </Row>
                  ))}
                  <Row />
                  <BottomLine />
                </Div322>
                <DayLineWrapper style={{ left: `${daylineOffset}px` }}>
                  <DayLine />
                </DayLineWrapper>
              </Div31>
            </Div30>
          </Div3>
        </Div1>
      </Wrapper>
    </Container>
  );
};

export default Timeline;
