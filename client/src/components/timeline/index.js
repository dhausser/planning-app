import React from 'react';
// import { useQuery, gql } from '@apollo/client';
// import { ScrollSync } from 'react-scroll-sync';
import styled from 'styled-components';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
// import EmptyState from '@atlaskit/empty-state';
// import { Loading } from '..';
// import Calendar from './calendar';
// import Headline from './headline';

import data from './sample.json';

const months = [
  'Jan\'19', 'Feb\'19', 'Mar\'19', 'Apr\'19', 'May\'19', 'Jun\'19', 'Jul\'19', 'Aug\'19', 'Sep\'19', 'Oct\'19', 'Nov\'19', 'Dec\'19',
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  'Jan\'21', 'Feb\'21', 'Mar\'21', 'Apr\'21', 'May\'21', 'Jun\'21', 'Jul\'21', 'Aug\'21', 'Sep\'21', 'Oct\'21', 'Nov\'21', 'Dec\'21',
];

const HEADLINE_WIDTH = 320;
const WIDTH = 9579.5;
const MONTH_WIDTH = WIDTH / months.length / 100;
const issues = data.epics;

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

function createEpic() {
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
}

export default function Timeline() {
  // const { loading, error, data } = useQuery(GET_EPICS);

  // if (loading || !data) return <Loading />;
  // if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <Wrapper>
      <ScrollWrapper>
        <HeadlineContainer width={HEADLINE_WIDTH} style={{ width: HEADLINE_WIDTH }}>
          <EpicTitleWrapper>
            <EpicTitle>Epic</EpicTitle>
            <EpicTitleBottom />
          </EpicTitleWrapper>
          <HeaderRowWrapper>
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <HeaderRowScrollBar>
                <HeaderRowScrollBarWidth width={HEADLINE_WIDTH - 2} style={{ width: HEADLINE_WIDTH - 2 }}>
                  {issues.map((epic) => (
                    <Row key={epic.key}>
                      <HeadlineRowContentWrapper>
                        <HeadlineRowContent>
                          <Epic16Icon />
                          <StyledParagraph>{epic.fields.summary}</StyledParagraph>
                        </HeadlineRowContent>
                      </HeadlineRowContentWrapper>
                    </Row>
                  ))}
                  <CreateButtonWrapper>
                    <CreateButton
                      role="button"
                      aria-label="Create issue last"
                      onClick={createEpic}
                      onKeyUp={createEpic}
                      tabIndex="0"
                    >
                      <EmojiCustomIcon className="icon" />
                    </CreateButton>
                  </CreateButtonWrapper>
                  <div style={{ height: '1px', backgroundColor: 'rgb(193, 199, 208)' }} />
                </HeaderRowScrollBarWidth>
              </HeaderRowScrollBar>
            </div>
            <HeaderRowBorder />
            <HeaderRowBorder width={HEADLINE_WIDTH} style={{ width: HEADLINE_WIDTH }} />
          </HeaderRowWrapper>
        </HeadlineContainer>
        <Div1>
          <Div2>
            <Div20>
              <Div21>
                <Div22>
                  {months.map((month, i) => (
                    <Div23 style={{ left: `calc(${i} * ${MONTH_WIDTH}%)`, right: `calc(100% - ${MONTH_WIDTH}% * ${i + 1})` }}>
                      <Div24>
                        {month}
                      </Div24>
                    </Div23>
                  ))}
                </Div22>
              </Div21>
            </Div20>
          </Div2>
          <Div3>
            <Div30>
              <Div31 width="9579px" style={{ width: '9579.5px' }}>
                <Div320 />
                <Div321 />
                <Div322>
                  {issues.map((issue) => (
                    <Row>
                      <Draggable draggable="true" style={{ left: '32.74%;', right: '64.51%;' }} />
                    </Row>
                  ))}
                </Div322>
              </Div31>
            </Div30>
          </Div3>
        </Div1>
        {/* <Calendar>
          <TimelineWrapper>
            {issues.map((issue) => (
              <div>
                <Row key={issue.key} />
              </div>
            ))}
          </TimelineWrapper>
          {months.map((month, i) => (
            <Divider key={month} style={{ left: `calc(${i} * ${MONTH_WIDTH}%)`, right: `calc(100% - ${MONTH_WIDTH}% * ${i + 1})` }}>
              <Header>
                <small style={{ marginTop: 'inherit' }}>{month}</small>
              </Header>
            </Divider>
          ))}
        </Calendar> */}
      </ScrollWrapper>
    </Wrapper>
  );
}

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const RowWrapper = styled.div`
  margin: 0;
  padding: 0;
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
    background-color: #DFE1E6;
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
  background: linear-gradient(90deg, rgb(135, 119, 217) 70%, rgb(192, 182, 242) 100%);

  left: 1.5%;
  right: 95%;
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

const Div321 = styled.div`
  background-color: rgba(9, 30, 66, 0.25);
`;

const Div322 = styled.div`
  position: relative;
  min-height: 100%;
  width: 9579.5px;
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

export const CreateButton = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 24px;
  width: 100%;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: #DFE1E6;
  }
`;

export const RowContainer = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 40px;
  width: inherit;
  background-color: rgb(255, 255, 255);
  cursor: pointer;
  transition: background-color 100ms linear 0s;
  overflow: hidden;

  &:nth-of-type(even) {
    background-color: rgb(244, 245, 247);
  }

  &:hover {
    background-color: #DFE1E6;
  }

  ${CreateButton} {
    background-color: #DFE1E6;
    fill: rebeccapurple;
  }
`;

const Calendar = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;

  &::-webkit-scrollbar {
    visibility: visible;
    z-index: 9;
    right: 7px;
    left: 7px;
    height: 10px;
    width: 10px;
    bottom: 0px;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.4);
    height: 100%;
    width: 39px;
    border-radius: 10px;
  }
`;

const Divider = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  border-right: 1px solid rgb(223, 225, 230);
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid rgb(193, 199, 208);
  border-bottom: 1px solid rgb(223, 225, 230);
  background-color: rgb(244, 245, 247);
  text-transform: uppercase;
`;

const TimelineWrapper = styled.div`
  position: absolute;
  top: 56px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;

  &::-webkit-scrollbar {
    position: absolute;
    visibility: visible;
    z-index: 9;
    right: 7px;
    left: 7px;
    height: 10px;
    width: 10px;
    bottom: 0px;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    position: relative;
    background-color: rgba(0, 0, 0, 0.4);
    height: 100%;
    width: 39px;
    border-radius: 10px;
  }
`;

const HeadlineContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  min-height: 0px;
  flex: 0 0 auto;
`;

// const InlineCreateWrapper = styled.div`
//   position: absolute;
//   top: -5px;
//   left: -10px;
//   right: 0px;
//   height: 10px;
//   /* cursor: pointer; */
//   z-index: 1;
//   outline: none;
// `;

// const InlineCreateButton = styled.div`
//   position: relative;
//   top: -5px;
//   left: 0px;
//   right: 0px;
//   height: 20px;
//   width: 20px;
//   /* cursor: pointer; */
// `;

const HeadlineRowContentWrapper = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-flex: 1;
  flex-grow: 1;
  height: 100%;
  padding-left: 24px;
  padding-right: 16px;
  overflow: hidden;
  outline: none;
  transition: box-shadow 0.2s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
`;

const HeadlineRowContent = styled.div`
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
`;

const HeaderRowWrapper = styled.div`
  position: relative;
  flex-direction: column;
  display: flex;
  margin-left: -10px;
  flex: 1 1 auto;
  overflow: hidden;
`;

const HeaderRowScrollBar = styled.div`
  width: 100%;
  overflow-y: auto;
  padding-right: 50px;
  flex: 0 0 auto;
`;

const HeaderRowScrollBarWidth = styled.div`
  background-color: rgba(9, 30, 66, 0.25);
  margin-left: 10px;
  border-left: 1px solid rgb(193, 199, 208);
  border-right: 1px solid rgb(193, 199, 208);
`;

const HeaderRowBorder = styled.div`
  margin-left: 10px;
  flex: 1 1 auto;
  border-left: 1px solid rgb(193, 199, 208);
  border-right: 1px solid rgb(193, 199, 208);
`;

const EpicTitleWrapper = styled.div`
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  background-color: rgb(244, 245, 247);
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(193, 199, 208) rgb(193, 199, 208) rgb(223, 225, 230);
  border-image: initial;
  border-bottom: 1px solid rgb(223, 225, 230);
  flex: 0 0 auto;
  padding: 0px 16px 0px 24px;
  border-radius: 3px 0px 0px;
`;

const EpicTitle = styled.p`
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0px;
  overflow: hidden;
`;

const EpicTitleBottom = styled.div`
  position: absolute;
  right: -3px;
  top: 0px;
  width: 8px;
  height: 100%;
  /* cursor: ew-resize; */
  z-index: 2;
  opacity: 0;
  transition: opacity 0.1s ease 0s;
`;

const CreateButtonWrapper = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 40px;
  background-color: rgb(255, 255, 255);
  -webkit-box-pack: center;
  justify-content: center;
  box-sizing: border-box;
  transition: background-color 100ms linear 0s;
  padding: 0px 8px;
`;

const StyledParagraph = styled.p`
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0px 0px 0px 8px;
  overflow: hidden;
`;
