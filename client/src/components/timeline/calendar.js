import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  'Jan 21',
  'Feb 21',
  'Mar 21',
  'Apr 21',
  'May 21',
  'Jun 21',
  'Jul 21',
  'Aug 21',
  'Sep 21',
  'Oct 21',
  'Nov 21',
  'Dec 21',
];

const MONTH_WIDTH = 20;
const WIDTH = MONTH_WIDTH * months.length;

export default function Calendar({ issues }) {
  return (
    <Wrapper>
      {/* <TimelineWrapper>
        {issues.map((issue) => <RowContainer key={issue.key} />)}
      </TimelineWrapper> */}
      {months.map((month, i) => (
        <Divider
          key={month}
          style={{
            left: `calc(${i} * ${MONTH_WIDTH}%)`,
            right: `calc(100% - ${MONTH_WIDTH}% * ${i + 1})`,
          }}
        >
          <Header>
            <small style={{ marginTop: 'inherit' }}>{month}</small>
          </Header>
        </Divider>
      ))}
    </Wrapper>
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
    background-color: #dfe1e6;
  }
`;

export const RowContainer = styled.div`
  /* position: relative; */
  /* display: flex; */
  /* -webkit-box-align: center; */
  /* align-items: center; */
  height: 40px;
  width: inherit;
  background-color: rgb(255, 255, 255);
  /* cursor: pointer; */
  transition: background-color 100ms linear 0s;
  overflow: hidden;

  &:nth-of-type(even) {
    background-color: rgb(244, 245, 247);
  }

  &:hover {
    background-color: #dfe1e6;
  }

  ${CreateButton} {
    background-color: #dfe1e6;
    fill: rebeccapurple;
  }
`;

const Wrapper = styled.div`
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
