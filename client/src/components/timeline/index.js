import React from 'react';
import styled from 'styled-components';
// import { useQuery, gql } from '@apollo/client';
// import { ScrollSync } from 'react-scroll-sync';
// import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
// import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
// import EmptyState from '@atlaskit/empty-state';

// import { Loading } from '..';
// import Calendar from './calendar';
import Headline from './headline';
import data from './sample.json';

const { issues, months } = data;
const WIDTH = 9579.5;
const MONTH_WIDTH = WIDTH / months.length / 100;
const daylineOffset = 320;

const left = 3;
const right = 95;

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

export default function Timeline() {
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
              <Div31 width="9579px" style={{ width: '9579.5px' }}>
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
                  {issues.map(issue => (
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
}

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

const Div1 = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0px;
  overflow: hidden;
`;

const Div2 = styled.div`
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  background-color: rgb(244, 245, 247);
  border-width: 1px 1px;
  border-style: solid none solid solid;
  border-color: rgb(193, 199, 208) rgb(193, 199, 208);
  border-image: initial;
  border-bottom: 1px solid rgb(223, 225, 230);
  border-right: none;
  overflow: hidden;
`;

const Div20 = styled.div`
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 50px;
`;

const Div21 = styled.div`
  display: flex;
  height: 54px;
  width: 9579.5px;
`;

const Div22 = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Div23 = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  box-sizing: border-box;
  flex: 0 0 auto;
  border-right: 1px solid rgb(223, 225, 230);
`;

const Div24 = styled.small`
  margin-top: 0px;
  text-transform: uppercase;
  color: #707070;
  font-size: 12px;
  line-height: 1.33333333333333;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 44px;
  background-color: rgb(255, 255, 255);
  /* transition: background-color 100ms linear 0s; */
  overflow: hidden;

  &:nth-of-type(even) {
    background-color: rgb(244, 245, 247);
  }

  &:hover {
    background-color: #dfe1e6;
  }
`;

const Draggable = styled.div`
  position: absolute;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: end;
  justify-content: flex-end;
  height: 24px;
  min-width: 3px;
  z-index: 3;
  visibility: visible;
  cursor: pointer;
  padding: 0px 5px;
  transition: left 0.1s ease 0s, right 0.1s ease 0s;
  border-radius: 3px 9px 9px 3px;
  background: linear-gradient(
    90deg,
    rgb(135, 119, 217) 70%,
    rgb(192, 182, 242) 100%
  );
`;

const BottomLine = styled.div`
  height: 1px;
  background-color: rgb(193, 199, 208);
`;

const Div3 = styled.div`
  position: absolute;
  top: 56px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
`;

const Div30 = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: -17px;
  bottom: -17px;
  overflow: scroll;
  border-left: 1px solid rgb(193, 199, 208);
`;

const Div31 = styled.div`
  position: relative;
  min-height: 100%;
`;

const Div320 = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const Divider = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  box-sizing: border-box;
  flex: 0 0 auto;
  border-right: 1px solid rgb(223, 225, 230);
`;

const Div321 = styled.div`
  background-color: rgba(9, 30, 66, 0.25);
`;

const StyledSvg = styled.svg`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  transition: opacity 0.2s ease-in-out 0s;
  overflow: visible;
`;

const Div322 = styled.div`
  position: relative;
  min-height: 100%;
  width: 9579.5px;
`;

const DayLineWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0px;
  bottom: 0px;
  z-index: 7;
`;

const DayLine = styled.div`
  background-color: rgb(255, 153, 31);
  height: 100%;
  width: 2px;

  ::before {
    content: '';
    position: absolute;
    height: 0px;
    width: 0px;
    top: 0px;
    left: -3px;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 8px solid rgb(255, 153, 31);
  }
`;

// const Calendar = styled.div`
//   position: relative;
//   height: 100%;
//   width: 100%;
//   min-height: 0px;
//   top: 0px;
//   left: 0px;
//   right: 0px;
//   bottom: 0px;
//   overflow: auto;

//   &::-webkit-scrollbar {
//     visibility: visible;
//     z-index: 9;
//     right: 7px;
//     left: 7px;
//     height: 10px;
//     width: 10px;
//     bottom: 0px;
//     border-radius: 10px;
//   }

//   &::-webkit-scrollbar-thumb {
//     background-color: rgba(0, 0, 0, 0.4);
//     height: 100%;
//     width: 39px;
//     border-radius: 10px;
//   }
// `;

// const TimelineWrapper = styled.div`
//   position: absolute;
//   top: 56px;
//   left: 0px;
//   right: 0px;
//   bottom: 0px;
//   overflow: auto;

//   &::-webkit-scrollbar {
//     position: absolute;
//     visibility: visible;
//     z-index: 9;
//     right: 7px;
//     left: 7px;
//     height: 10px;
//     width: 10px;
//     bottom: 0px;
//     border-radius: 10px;
//   }

//   &::-webkit-scrollbar-thumb {
//     position: relative;
//     background-color: rgba(0, 0, 0, 0.4);
//     height: 100%;
//     width: 39px;
//     border-radius: 10px;
//   }
// `;
