import React from 'react';
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme';
import { priorityIconMap } from './Icon';

const Priority: React.FC<{ id: string }> = ({ id }) => {
  return (
    <>
      <h6>Priority</h6>
      <Wrapper>{priorityIconMap[id]}</Wrapper>
    </>
  );
};

export default Priority;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Wrapper = styled.div`
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
`;
