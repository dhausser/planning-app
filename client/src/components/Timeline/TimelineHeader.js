import React from 'react';
import styled from 'styled-components';
import { ScrollSyncPane } from 'react-scroll-sync';

export const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function TimelineHeader() {
  return (
    <TimelineHeaderContainer>
      <ScrollSyncPane>
        <TimelineHeaderWrapper>
          <TimelineHeaderHorizontal style={{ width: '9579.5px' }}>
            <TimelineHeaderBox>
              {months.map((month, i) => (
                <StyledHeader key={month} style={{ left: `calc(${i} * 2.702702702702703%)`, right: `calc(100% - 2.702702702702703% * ${i + 1})` }}>
                  <StyledSmall>{month}</StyledSmall>
                </StyledHeader>
              ))}
            </TimelineHeaderBox>
          </TimelineHeaderHorizontal>
        </TimelineHeaderWrapper>
      </ScrollSyncPane>
    </TimelineHeaderContainer>
  );
}

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

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
`;

const TimelineHeaderWrapper = styled.div`
height: 100%;
overflow: hidden;
`;

const TimelineHeaderHorizontal = styled.div`
display: flex;
height: 54px;
`;

const TimelineHeaderBox = styled.div`
position: relative;
width: 100%;
height: 100%;
`;

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
`;

const StyledSmall = styled.small`
  margin-top: 0px;
  text-transform: uppercase;
`;
