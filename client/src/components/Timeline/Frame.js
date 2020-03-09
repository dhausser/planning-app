import React from 'react';
import { Frame, useMotionValue } from 'framer';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default function FrameBox({ issue }) {
  const x = useMotionValue(0);
  return (
    <RowContainer key={issue.key}>
      <Frame
        name="Epic"
        x={x}
        size={24}
        radius={3}
        width={300}
        left={0}
        // right={300}
        background="#8777d9"
        drag="x"
        dragConstraints={{ left: 0, right: 1300 }}
        dragElastic={0}
        dragMomentum={false}
      >
        <EpicDragLeft orientation="left">
          <EpicDrag />
        </EpicDragLeft>
        <EpicDragRight orientation="right">
          <EpicDrag />
        </EpicDragRight>
      </Frame>
    </RowContainer>
  );
}

FrameBox.propTypes = {
  issue: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }).isRequired,
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
    background-color: #DFE1E6;
  }
`;

export const RowContainer = styled.div`
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

  ${CreateButton} {
    background-color: #DFE1E6;
    fill: rebeccapurple;
  }
`;

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
    left: '0%';
    right: '10%';
  }
`;

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
`;

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
`;

const EpicDrag = styled.div`
  width: 6px;
  height: 16px;
  background-color: rgb(64, 50, 148);
  border-radius: 3px;
`;
