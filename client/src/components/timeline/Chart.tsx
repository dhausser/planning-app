import React, { FunctionComponent } from 'react';
import { ScrollSyncPane } from 'react-scroll-sync';
import styled from 'styled-components';
import { MockIssue } from '../../types';

interface Props {
  issues: MockIssue[];
  months: Array<string>;
}

const RoadmapChart: FunctionComponent<Props> = ({ issues, months }) => {
  const WIDTH = 9579.5;
  const MONTH_WIDTH: number = WIDTH / months.length / 100;
  // const todayFormatted = new Date().toLocaleDateString();
  const todayPosition = 764;
  const left = 5.32;
  const right = 92;

  return (
    <Chart>
      <ChartHeader>
        <ScrollSyncPane>
          <StyledDiv20>
            <HeaderCells>
              <StyledDiv22>
                {months.map((month, i) => (
                  <MonthCell
                    key={month}
                    style={{
                      left: `calc(${i} * ${MONTH_WIDTH}%)`,
                      right: `calc(100% - ${MONTH_WIDTH}% * ${i + 1})`,
                    }}
                  >
                    <StyledSmall>{month}</StyledSmall>
                  </MonthCell>
                ))}
              </StyledDiv22>
            </HeaderCells>
          </StyledDiv20>
        </ScrollSyncPane>
      </ChartHeader>
      <ScrollBars>
        <ScrollSyncPane>
          <WithSynchronizedScroll id="sr-timeline">
            <StyledDiv31 style={{ width: `${WIDTH}px` }}>
              <ColumnsOverlay>
                {months.map((month, i) => (
                  <Column
                    key={month}
                    style={{
                      left: `calc(${i} * ${MONTH_WIDTH}%)`,
                      right: `calc(100% - ${MONTH_WIDTH}% * ${i + 1})`,
                    }}
                  />
                ))}
              </ColumnsOverlay>
              <SvgOverlay>
                <StyledSvg />
              </SvgOverlay>
              <RoadmapChartItems>
                <FlatItems>
                  {issues.map((issue) => (
                    <ChartItemDropTarget key={issue.key}>
                      {/* <WrappedChartItem> */}
                      {/* <ChartItem> */}
                      {/* <Bar> */}
                      <DraggableBar
                        draggable="true"
                        style={{ left: `${left}%`, right: `${right}%` }}
                      >
                        {/* <BaseBar> */}
                        {/* <DependenciesIcon /> */}
                        <DependenciesBarExtension>
                          <DependenciesWrapper />
                        </DependenciesBarExtension>
                        <DependenciesDropTarget />
                        <LeftDraggableHandle>
                          <DraggableHandle />
                        </LeftDraggableHandle>
                        <RightDraggableHandle>
                          <DraggableHandle />
                        </RightDraggableHandle>
                        {/* </BaseBar> */}
                      </DraggableBar>
                      {/* </Bar> */}
                      {/* </ChartItem> */}
                      {/* </WrappedChartItem> */}
                    </ChartItemDropTarget>
                  ))}
                </FlatItems>
                <ChartItemDropTarget />
                <BottomLine />
              </RoadmapChartItems>
              <TodayMarker style={{ left: `${todayPosition}px` }}>
                <TodayLine />
              </TodayMarker>
            </StyledDiv31>
          </WithSynchronizedScroll>
        </ScrollSyncPane>
      </ScrollBars>
    </Chart>
  );
};

export default RoadmapChart;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Chart = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0px;
  overflow: hidden;
`;

const ChartHeader = styled.div`
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

const StyledDiv20 = styled.div`
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 50px;
`;

const HeaderCells = styled.div`
  display: flex;
  height: 54px;
  width: 9579.5px;
`;

const StyledDiv22 = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MonthCell = styled.div`
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
  color: #707070;
  font-size: 12px;
  line-height: 1.33333333333333;
`;

const RoadmapChartItems = styled.div`
  position: relative;
  min-height: 100%;
  width: 9579.5px;
`;

const FlatItems = styled.div``;

const ChartItemDropTarget = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 44px;
  background-color: rgb(255, 255, 255);
  transition: background-color 100ms linear 0s;
  overflow: hidden;

  &:nth-of-type(even) {
    background-color: rgb(244, 245, 247);
  }

  &:hover {
    background-color: #dfe1e6;
  }
`;

// const WrappedChartItem = styled.div`
//   position: absolute;
// `;

// const ChartItem = styled.div`
//   position: absolute;
// `;

// const Bar = styled.div`
//   position: absolute;
// `;

// const BaseBar = styled.div`
//   position: absolute;
// `;

// const DependenciesIcon = styled.div`
//   position: absolute;
// `;

const DependenciesBarExtension = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  padding: 0px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  -moz-box-pack: end;
  justify-content: flex-end;
  -moz-box-align: center;
  align-items: center;
  overflow: hidden;
  z-index: 4;
  pointer-events: none;
  transform: translate3d(0px, 0px, 0px);
`;

const DependenciesWrapper = styled.div`
  display: flex;
  width: 20px;
  height: 20px;
  -moz-box-align: center;
  align-items: center;
  -moz-box-pack: center;
  justify-content: center;
  margin-right: 4px;
  border-radius: 50%;
  pointer-events: all;

  :last-child {
    margin-right: 0px;
  }
`;

const DependenciesDropTarget = styled.div`
  position: absolute;
  inset: 0px;
  pointer-events: none;
  border-radius: 3px 9px 9px 3px;
  z-index: 5;

  ::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    border-radius: 3px 9px 9px 3px;
    box-shadow: rgb(82, 67, 170) 0px 0px 0px 2px inset;
    transition: opacity 0.1s ease-in-out 0s;
  }
`;

const LeftDraggableHandle = styled.div`
  visibility: hidden;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  padding: 4px;
  cursor: col-resize;
`;

const RightDraggableHandle = styled.div`
  visibility: hidden;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  padding: 4px;
  cursor: col-resize;
`;

const DraggableHandle = styled.div`
  margin: 0;
  padding: 0;
  width: 6px;
  height: 16px;
  background-color: rgb(64, 50, 148);
  border-radius: 3px;
`;

const DraggableBar = styled.div`
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

  :hover {
    ${LeftDraggableHandle} {
      visibility: visible;
    }
    ${RightDraggableHandle} {
      visibility: visible;
    }
  }
`;

const BottomLine = styled.div`
  height: 1px;
  background-color: rgb(193, 199, 208);
`;

const ScrollBars = styled.div`
  position: absolute;
  top: 56px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
`;

const WithSynchronizedScroll = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: -17px;
  bottom: -17px;
  overflow: scroll;
  border-left: 1px solid rgb(193, 199, 208);
`;

const StyledDiv31 = styled.div`
  position: relative;
  min-height: 100%;
`;

const ColumnsOverlay = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const Column = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  box-sizing: border-box;
  flex: 0 0 auto;
  border-right: 1px solid rgb(223, 225, 230);
`;

const SvgOverlay = styled.div`
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

const TodayMarker = styled.div`
  position: absolute;
  display: flex;
  top: 0px;
  bottom: 0px;
  z-index: 7;
`;

const TodayLine = styled.div`
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
