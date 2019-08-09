import React, { useState } from 'react';
import posed from 'react-pose';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import './styles.css';

import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import months from './sample-data';

const HeadlineRow = (epic, i) => (
  <RowContainer key={epic.key} data-test-id="roadmap.common.components.table.components.list-item.base.container" draggable="true">
    {i > 0 && (
    <InlineCreateWrapper data-test-id={`roadmap.common.components.table.components.list-item.base.inline-create-button-${i}`} role="button" aria-label="Inline issue create" tabIndex="0">
      <InlineCreateButton />
    </InlineCreateWrapper>
    )}
    <HeadlineRowContentWrapper data-test-id={`roadmap.common.components.table.components.list-item.base.content-container-${i}`}>
      <HeadlineRowContent>
        <EpicIcon
          src="https://solarsystem.atlassian.net/secure/viewavatar?size=medium&avatarId=10307&avatarType=issuetype"
          alt="Epic issue type"
        />
        <p className="sc-bcdylZ kzvagL">{epic.fields.summary}</p>
      </HeadlineRowContent>
    </HeadlineRowContentWrapper>
  </RowContainer>
);

const TimelineColumnHeader = (month, i) => (
  <div key={month} className="rWwYB" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }}>
    <small className="dRfJrE">{month}</small>
  </div>
);

const TimelineColumn = (month, i) => (
  <div key={month} className="sc-liPmeQ inHpzx" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }} />
);


const TimelineHeader = () => (
  <div className="dkFNrj">
    <div className="wWWya">
      <div className="hTdzhs" width="9579.499999901622" style={{ width: '9579.5px' }}>
        <div className="cZzQw">
          {months.map(TimelineColumnHeader)}
        </div>
      </div>
    </div>
  </div>
);

const Box = posed.div({
  draggable: 'x',

});

const TimelineRow = (epic) => {
  const onStart = () => {};
  const onEnd = () => {};
  const onDrag = () => {};

  return (
    <RowContainer key={epic.key}>
      <Box
        className="sc-buGlAa feIyeE"
        style={{ width: '200px' }}
        onDragStart={onStart}
        onDragEnd={onEnd}
        onValueChange={{ x: onDrag }}
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
    </RowContainer>
  );
};

const InlineDragIndicator = () => (
  <div className="inline-drag-indicator inline-drag-indicator-top jMrzDz">
    <div className="grZjms" />
  </div>
);

const InlineCreate = () => (
  <div className="inline-create-button eaYLQY">
    <div className="hKwvKb">
      <div className="kkkFIk" />
      <div className="cpqXQZ">
        <div className="bIeuYl">
          <EmojiCustomIcon className="bcqBjl" />
        </div>
      </div>
    </div>
  </div>
);

export default function Timeline({ epics }) {
  const [issues, setIssues] = useState(epics);

  const createEpic = () => {
    const { length } = issues;
    const num = length + 1;
    const issue = {
      id: `${num}`,
      key: `ST-${num}`,
      fields: {
        summary: `Epic Number ${num}`,
      },
    };
    setIssues([...issues, issue]);
  };

  return (
    <Wrapper>
      <Wrapper2>
        <HeadlineContainer data-test-id="roadmap.common.components.table.components.list.container" width="320" style={{ width: '320px' }}>
          <EpicTitleWrapper>
            <EpicTitle>Epic</EpicTitle>
            <EpicTitleBottom />
          </EpicTitleWrapper>

          <HeaderRowWrapper>
            <div style={{ display: 'flex', overflow: 'hidden' }}>
              <HeaderRowScrollBar data-test-id="roadmap.common.components.table.components.list.hidden-scrollbar">
                <HeaderRowScrollBarWidth width="318" style={{ width: '318px' }}>
                  {epics.map(HeadlineRow)}
                  <CreateButtonWrapper>
                    <CreateButton data-test-id="roadmap.common.components.table.components.list.items.create-item.button" role="button" aria-label="Create issue last" onClick={createEpic} onKeyUp={createEpic} tabIndex="0">
                      <EmojiCustomIcon className="dqqHMN" />
                    </CreateButton>
                  </CreateButtonWrapper>
                  <div style={{ height: '1px', backgroundColor: 'rgb(193, 199, 208)' }} />
                </HeaderRowScrollBarWidth>
              </HeaderRowScrollBar>
            </div>
            <HeaderRowBorder width="318" style={{ width: '318px' }} />
          </HeaderRowWrapper>
        </HeadlineContainer>
        <TimelineContainer>
          <TimelineHeader />
          <TimelineWrapper>
            <TimelineBox id="sr-timeline">
              <div width="9579.499999901622" style={{ width: '9579.5px', position: 'relative', minHeight: '100%' }}>
                <VerticalDivider>
                  {months.map(TimelineColumn)}
                </VerticalDivider>
                <TimelineBox1 />
                {epics.map(TimelineRow)}
                <TimelineBox2 />
                <div style={{ height: '1px', backgroundColor: 'rgb(193, 199, 208)' }} />
              </div>
            </TimelineBox>
            <TimelineBottomWrapper1>
              <TimelineBottom1 size="39" style={{ transform: 'translateX(0px)' }} />
            </TimelineBottomWrapper1>
            <TimelineBottomWrapper2>
              <TimelineBottom2 size="99" style={{ transform: 'translateX(0px)' }} />
            </TimelineBottomWrapper2>
          </TimelineWrapper>

          {/* <FDEAOq />
          <CvTvEa /> */}

        </TimelineContainer>

        <FjLAd />
        <InlineDragIndicator />
        <InlineCreate />

      </Wrapper2>
    </Wrapper>
  );
}

Timeline.propTypes = {
  epics: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};

/**
 * Styled Components
 */

const Wrapper = styled.div`
  position: relative;
  margin-top: 24px;
  flex: 1 1 auto;
`;

const Wrapper2 = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const HeadlineContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  min-height: 0px;
  flex: 0 0 auto;
`;

const RowContainer = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 40px;
  background-color: rgb(255, 255, 255);
  cursor: pointer;
  transition: background-color 100ms linear 0s;

  &:nth-last-of-type(even) {
    background-color: rgb(244, 245, 247);
  }

  &:hover {
    background-color: #DFE1E6;
  }
`;

const InlineCreateWrapper = styled.div`
  position: absolute;
  top: -5px;
  left: -10px;
  right: 0px;
  height: 10px;
  cursor: pointer;
  z-index: 1;
  outline: none;
`;

const InlineCreateButton = styled.div`
  position: relative;
  top: -5px;
  left: 0px;
  right: 0px;
  height: 20px;
  width: 20px;
  cursor: pointer;
`;

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


const TimelineWrapper = styled.div`
  position: absolute;
  top: 56px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
`;

const TimelineBox = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: -17px;
  bottom: -17px;
  overflow: auto;
  border-left: 1px solid rgb(193, 199, 208);
`;

const TimelineBox1 = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 2;
`;
const TimelineBox2 = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 40px;
  background-color: rgb(255, 255, 255);
  transition: background-color 100ms linear 0s;
`;

const TimelineBottomWrapper1 = styled.div`
  position: absolute;
  visibility: visible;
  z-index: 9;
  right: 7px;
  left: 7px;
  height: 10px;
  bottom: 0px;
  border-radius: 10px;
`;
const TimelineBottom1 = styled.div`
  position: relative;
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 39px;
  border-radius: 10px;
`;

const TimelineBottomWrapper2 = styled.div`
  position: absolute;
  visibility: hidden;
  z-index: 9;
  top: 7px;
  bottom: 7px;
  width: 10px;
  right: 0px;
  border-radius: 10px;
`;

const TimelineBottom2 = styled.div`
  position: relative;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 99px;
  border-radius: 10px;
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
  cursor: ew-resize;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.1s ease 0s;
`;

const EpicIcon = styled.img`
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  border-radius: 3px;
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
    background-color: #DFE1E6;
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0px;
  overflow: hidden;
`;

const VerticalDivider = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const EpicDragLeft = styled.div`
  visibility: hidden;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  cursor: col-resize;
  padding: 4px;
`;

const EpicDragRight = styled.div`
  visibility: hidden;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  cursor: col-resize;
  padding: 4px;
`;

const EpicDrag = styled.div`
  width: 6px;
  height: 16px;
  background-color: rgb(64, 50, 148);
  border-radius: 3px;
`;

const FDEAOq = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0px;
  overflow: hidden;
`;

const CvTvEa = styled.div`
  position: absolute;
  pointer-events: none;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 11;
  clip: rect(0px, auto, auto, 0px);
  clip-path: inset(0px);
`;

const FjLAd = styled.div`
  position: fixed;
  pointer-events: none;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 11;
`;
