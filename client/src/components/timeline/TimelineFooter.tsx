import React from 'react';
import styled from 'styled-components';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';

const TimelineFooter: React.FC = () => {
  return (
    <>
      <TimelineBottom3 />
      <TimelineBottom4>
        <TimelineBottom5 />
      </TimelineBottom4>
      <InlineCreate1>
        <InlineCreate2>
          <InlineCreate3 />
          <InlineCreate4>
            <InlineCreate5>
              <EmojiCustomIcon label="icon" />
            </InlineCreate5>
          </InlineCreate4>
        </InlineCreate2>
      </InlineCreate1>
    </>
  );
};

export default TimelineFooter;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const TimelineBottom3 = styled.div`
  position: fixed;
  pointer-events: none;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 11;
`;

const TimelineBottom4 = styled.div`
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 10;
`;

const TimelineBottom5 = styled.div`
  width: 100%;
  height: 2px;
  background-color: rgb(0, 101, 255);
`;

const InlineCreate1 = styled.div`
  display: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 10;
`;

const InlineCreate2 = styled.div`
  position: relative;
  top: -5px;
  left: 0px;
  height: 20px;
  width: calc(100% + 10px);
  cursor: pointer;
`;

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
`;

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
`;

const InlineCreate5 = styled.div`
  height: 24px;
  width: 24px;
  position: relative;
  margin-left: -2px;
  margin-top: -2px;
`;
