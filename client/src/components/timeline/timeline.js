import React, { useState } from "react"
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync"
import PropTypes from "prop-types"
import styled from "styled-components"
import EmojiCustomIcon from "@atlaskit/icon/glyph/emoji/custom"
import months from "./sample-data"
import "./styles.css"

export default function Timeline({ epics }) {
  const [issues, setIssues] = useState(epics)

  const createEpic = () => {
    const { length } = issues
    const num = length + 1
    const issue = {
      id: `${num}`,
      key: `ST-${num}`,
      fields: {
        summary: `Epic Number ${num}`,
      },
    }
    setIssues([...issues, issue])
  }

  return (
    <Wrapper>
      <ScrollSync>
        <Wrapper2>
          <HeadlineContainer
            data-test-id="roadmap.common.components.table.components.list.container"
            width="320"
            style={{ width: "320px" }}
          >
            <EpicTitleWrapper>
              <EpicTitle>Epic</EpicTitle>
              <EpicTitleBottom />
            </EpicTitleWrapper>
            <HeaderRowWrapper>
              <div style={{ display: "flex", overflow: "hidden" }}>
                <ScrollSyncPane>
                  <HeaderRowScrollBar data-test-id="roadmap.common.components.table.components.list.hidden-scrollbar">
                    <HeaderRowScrollBarWidth
                      width="318"
                      style={{ width: "318px" }}
                    >
                      {issues.map((epic, i) => (
                        <RowContainer
                          key={epic.key}
                          data-test-id="roadmap.common.components.table.components.list-item.base.container"
                          draggable="true"
                        >
                          {i > 0 && (
                            <InlineCreateWrapper
                              data-test-id={`roadmap.common.components.table.components.list-item.base.inline-create-button-${i}`}
                              role="button"
                              aria-label="Inline issue create"
                              tabIndex="0"
                            >
                              <InlineCreateButton />
                            </InlineCreateWrapper>
                          )}
                          <HeadlineRowContentWrapper
                            data-test-id={`roadmap.common.components.table.components.list-item.base.content-container-${i}`}
                          >
                            <HeadlineRowContent>
                              <EpicIcon
                                src="https://solarsystem.atlassian.net/secure/viewavatar?size=medium&avatarId=10307&avatarType=issuetype"
                                alt="Epic issue type"
                              />
                              <StyledParagraph>
                                {epic.fields.summary}
                              </StyledParagraph>
                            </HeadlineRowContent>
                          </HeadlineRowContentWrapper>
                        </RowContainer>
                      ))}
                      <CreateButtonWrapper>
                        <CreateButton
                          data-test-id="roadmap.common.components.table.components.list.items.create-item.button"
                          role="button"
                          aria-label="Create issue last"
                          onClick={createEpic}
                          onKeyUp={createEpic}
                          tabIndex="0"
                        >
                          <EmojiCustomIcon className="icon" />
                        </CreateButton>
                      </CreateButtonWrapper>
                      <div
                        style={{
                          height: "1px",
                          backgroundColor: "rgb(193, 199, 208)",
                        }}
                      />
                    </HeaderRowScrollBarWidth>
                  </HeaderRowScrollBar>
                </ScrollSyncPane>
              </div>
              <HeaderRowBorder width="318" style={{ width: "318px" }} />
            </HeaderRowWrapper>
          </HeadlineContainer>
          <TimelineContainer>
            <TimelineHeaderContainer>
              <ScrollSyncPane>
                <TimelineHeaderWrapper>
                  <TimelineHeaderHorizontal style={{ width: "9579.5px" }}>
                    <TimelineHeaderBox>
                      {months.map((month, i) => (
                        <StyledHeader
                          key={month}
                          style={{
                            left: `calc(${i} * 2.702702702702703%)`,
                            right: `calc(100% - 2.702702702702703% * ${i + 1})`,
                          }}
                        >
                          <StyledSmall>{month}</StyledSmall>
                        </StyledHeader>
                      ))}
                    </TimelineHeaderBox>
                  </TimelineHeaderHorizontal>
                </TimelineHeaderWrapper>
              </ScrollSyncPane>
            </TimelineHeaderContainer>
            <TimelineWrapper>
              <ScrollSyncPane>
                <TimelineBox id="sr-timeline">
                  <HorizontalCalendar style={{ width: "9579.5px" }}>
                    <VerticalDivider>
                      {months.map((month, i) => (
                        <StyledColumn
                          key={month}
                          style={{
                            left: `calc(${i} * 2.702702702702703%)`,
                            right: `calc(100% - 2.702702702702703% * ${i + 1})`,
                          }}
                        />
                      ))}
                    </VerticalDivider>
                    <TimelineBox1 />
                    {issues.map(epic => (
                      <RowContainer key={epic.key}>
                        {/* <BoxWrapper style={{ left: '2%', right: '94%' }}> */}
                        <Box
                          className="box"
                          style={{ left: "2.7%", right: "94.6%" }}
                          onDragStart={() => {}}
                          onDragEnd={() => {}}
                          onValueChange={{ x: () => {} }}
                          onMouseOver={() => {}}
                          onFocus={() => {}}
                        >
                          <EpicDragLeft orientation="left">
                            <EpicDrag />
                          </EpicDragLeft>
                          <EpicDragRight orientation="right">
                            <EpicDrag />
                          </EpicDragRight>
                        </Box>
                        {/* </BoxWrapper> */}
                      </RowContainer>
                    ))}
                    <TimelineBox2 />
                    <div
                      style={{
                        height: "1px",
                        backgroundColor: "rgb(193, 199, 208)",
                      }}
                    />
                  </HorizontalCalendar>
                </TimelineBox>
              </ScrollSyncPane>
            </TimelineWrapper>
            {/* <TimelineBottom1 /> */}
            <TimelineBottom2 />
          </TimelineContainer>
          <TimelineBottom3 />
          <TimelineBottom4>
            <TimelineBottom5 />
          </TimelineBottom4>
          <InlineCreate1>
            <InlineCreate2>
              <InlineCreate3 />
              <InlineCreate4>
                <InlineCreate5>
                  <EmojiCustomIcon className="icon" />
                </InlineCreate5>
              </InlineCreate4>
            </InlineCreate2>
          </InlineCreate1>
        </Wrapper2>
      </ScrollSync>
    </Wrapper>
    // </Container>
  )
}

Timeline.defaultProps = {
  epics: [],
}

Timeline.propTypes = {
  epics: PropTypes.arrayOf(PropTypes.objectOf),
}

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Wrapper = styled.div`
  position: relative;
  margin-top: 8px;
  flex: 1 1 auto;
`

const Wrapper2 = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`

const HeadlineContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  min-height: 0px;
  flex: 0 0 auto;
`

const InlineCreateWrapper = styled.div`
  position: absolute;
  top: -5px;
  left: -10px;
  right: 0px;
  height: 10px;
  cursor: pointer;
  z-index: 1;
  outline: none;
`

const InlineCreateButton = styled.div`
  position: relative;
  top: -5px;
  left: 0px;
  right: 0px;
  height: 20px;
  width: 20px;
  cursor: pointer;
`

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
`

const HeadlineRowContent = styled.div`
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
`

const HeaderRowWrapper = styled.div`
  position: relative;
  flex-direction: column;
  display: flex;
  margin-left: -10px;
  flex: 1 1 auto;
  overflow: hidden;
`

const HeaderRowScrollBar = styled.div`
  width: 100%;
  overflow-y: auto;
  padding-right: 50px;
  flex: 0 0 auto;
`

const HeaderRowScrollBarWidth = styled.div`
  background-color: rgba(9, 30, 66, 0.25);
  margin-left: 10px;
  border-left: 1px solid rgb(193, 199, 208);
  border-right: 1px solid rgb(193, 199, 208);
`

const HeaderRowBorder = styled.div`
  margin-left: 10px;
  flex: 1 1 auto;
  border-left: 1px solid rgb(193, 199, 208);
  border-right: 1px solid rgb(193, 199, 208);
`

const TimelineHeaderContainer = styled.div`
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  background-color: rgb(244, 245, 247);
  border-width: 1px 1px;
  border-style: solid none solid solid;
  border-color: rgb(193, 199, 208) rgb(193, 199, 208);
  border-image: none;
  border-image: initial;
  border-bottom: 1px solid rgb(223, 225, 230);
  border-right: none;
  overflow: hidden;
`

const TimelineHeaderWrapper = styled.div`
  height: 100%;
  overflow: hidden;
`

const TimelineHeaderHorizontal = styled.div`
  display: flex;
  height: 54px;
`

const TimelineHeaderBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const HorizontalCalendar = styled.div`
  position: relative;
  min-height: 100%;
`

const TimelineWrapper = styled.div`
  position: absolute;
  top: 56px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
`

const TimelineBox = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;
  border-left: 1px solid rgb(193, 199, 208);

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
    /* height: 100%; */
    /* width: 39px; */
    border-radius: 10px;
  }
`

const TimelineBox1 = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 2;
`

const TimelineBox2 = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 40px;
  background-color: rgb(255, 255, 255);
  transition: background-color 100ms linear 0s;
`

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
`

const EpicTitle = styled.p`
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0px;
  overflow: hidden;
`

const EpicTitleBottom = styled.div`
  position: absolute;
  right: -3px;
  top: 0px;
  width: 8px;
  height: 100%;
  cursor: ew-resize;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.1s ease 0s;
`

const EpicIcon = styled.img`
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  border-radius: 3px;
`

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
`

const CreateButton = styled.div`
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
    background-color: #dfe1e6;
  }
`

const TimelineContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0px;
  overflow: hidden;
`

const VerticalDivider = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`

/**
 * TODO: Highlight corresponding pair row on hover
 */
const RowContainer = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 40px;
  background-color: rgb(255, 255, 255);
  cursor: pointer;
  transition: background-color 100ms linear 0s;

  &:nth-of-type(even) {
    background-color: rgb(244, 245, 247);
  }

  &:hover {
    background-color: #DFE1E6;
  }

  /* ${CreateButton}:hover & {
    background-color: #DFE1E6;
    fill: rebeccapurple;
  } */

  ${CreateButton} {
    background-color: #DFE1E6;
    fill: rebeccapurple;
  }
`

const Box = styled.div({})

const BoxWrapper = styled.div`
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
  border-radius: 3px;
  background: rgb(135, 119, 217);

  :hover {
    background-color: paleturquoise;
    left: "0%";
    right: "10%";
  }
`

const EpicDragLeft = styled.div`
  visibility: hidden;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  cursor: col-resize;
  padding: 4px;

  ${BoxWrapper}:hover & {
    visibility: visible;
  }
`

const EpicDragRight = styled.div`
  visibility: hidden;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  cursor: col-resize;
  padding: 4px;

  ${BoxWrapper}:hover & {
    visibility: visible;
  }
`

const EpicDrag = styled.div`
  width: 6px;
  height: 16px;
  background-color: rgb(64, 50, 148);
  border-radius: 3px;
`

// const TimelineBottom1 = styled.div`
//   position: relative;
//   height: 100%;
//   width: 100%;
//   min-height: 0px;
//   overflow: hidden;
// `;

const TimelineBottom2 = styled.div`
  position: absolute;
  pointer-events: none;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 11;
  clip: rect(0px, auto, auto, 0px);
  clip-path: inset(0px);
`

const TimelineBottom3 = styled.div`
  position: fixed;
  pointer-events: none;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 11;
`

const TimelineBottom4 = styled.div`
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 10;
`

const TimelineBottom5 = styled.div`
  width: 100%;
  height: 2px;
  background-color: rgb(0, 101, 255);
`

const StyledParagraph = styled.p`
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0px 0px 0px 8px;
  overflow: hidden;
`

const StyledHeader = styled.div`
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
`

const StyledSmall = styled.small`
  margin-top: 0px;
  text-transform: uppercase;
`

const StyledColumn = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  box-sizing: border-box;
  flex: 0 0 auto;
  border-right: 1px solid rgb(223, 225, 230);
`

const InlineCreate1 = styled.div`
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 10;
`
const InlineCreate2 = styled.div`
  position: relative;
  top: -5px;
  left: 0px;
  height: 20px;
  width: calc(100% + 10px);
  cursor: pointer;
`
const InlineCreate3 = styled.div`
  position: relative;
  top: 9px;
  width: 100%;
  height: 2px;
  background-color: rgb(0, 101, 255);
  opacity: 0;
  animation-name: eMLfYp;
  animation-duration: 0.2s;
  animation-delay: 0.3s;
  animation-fill-mode: forwards;
`
const InlineCreate4 = styled.div`
  position: absolute;
  height: 20px;
  width: 20px;
  top: 0px;
  left: 0px;
  background-color: rgb(0, 101, 255);
  color: rgb(255, 255, 255);
  opacity: 0;
  animation-name: eMLfYp;
  animation-duration: 0.2s;
  animation-delay: 0.3s;
  animation-fill-mode: forwards;
  border-radius: 3px;
`
const InlineCreate5 = styled.div`
  height: 24px;
  width: 24px;
  position: relative;
  margin-left: -2px;
  margin-top: -2px;
`
