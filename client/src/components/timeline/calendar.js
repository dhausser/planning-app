import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ScrollSyncPane } from 'react-scroll-sync';
import Frame from './frame';
import TimelineHeader, { months, CALENDAR_WIDTH, MONTH_WIDTH } from './timeline-header';

const CALENDAR_WIDTH_PX = '2500px';

export default function Calendar({ issues }) {
  return (
    <TimelineContainer>
      <TimelineHeader />
      <TimelineWrapper>
        <ScrollSyncPane>
          <TimelineBox id="sr-timeline">
            <HorizontalCalendar style={{ width: CALENDAR_WIDTH }}>
              <VerticalDivider>
                {months.map((month, i) => (
                  <StyledColumn key={month} style={{ left: `calc(${i} * ${MONTH_WIDTH}%)`, right: `calc(100% - ${MONTH_WIDTH}% * ${i + 1})` }} />
                ))}
              </VerticalDivider>
              <TimelineBox1 />
              {issues.map((issue) => <Frame key={issue.key} issue={issue} />)}
              <TimelineBox2 />
              <div style={{ height: '1px', width: CALENDAR_WIDTH_PX, backgroundColor: 'rgb(193, 199, 208)' }} />
            </HorizontalCalendar>
          </TimelineBox>
        </ScrollSyncPane>
      </TimelineWrapper>
      {/* <TimelineBottom2 /> */}
    </TimelineContainer>
  );
}

Calendar.defaultProps = {
  issues: [],
};

Calendar.propTypes = {
  issues: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string.isRequired }),
  ),
};

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const HorizontalCalendar = styled.div`
  position: relative;
  min-height: 100%;
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

// const TimelineBottom2 = styled.div`
//   position: absolute;
//   pointer-events: none;
//   left: 0px;
//   top: 0px;
//   bottom: 0px;
//   right: 0px;
//   z-index: 11;
//   clip: rect(0px, auto, auto, 0px);
//   clip-path: inset(0px);
// `;

const StyledColumn = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  box-sizing: border-box;
  flex: 0 0 auto;
  border-right: 1px solid rgb(223, 225, 230);
`;
