import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Frame from './frame';

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const WIDTH = 250;
const MONTH_WIDTH = WIDTH / months.length;

export default function Calendar({ issues }) {
  return (
    <Wrapper>
      {months.map((month, i) => (
        <Divider key={month} style={{ left: `calc(${i} * ${MONTH_WIDTH}%)`, right: `calc(100% - ${MONTH_WIDTH}% * ${i + 1})` }}>
          <Header>
            <small style={{ marginTop: 'inherit' }}>{month}</small>
          </Header>
        </Divider>
      ))}
      <TimelineWrapper>
        {issues.map((issue) => <Frame key={issue.key} issue={issue} />)}
      </TimelineWrapper>
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
