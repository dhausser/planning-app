import React, { ReactElement } from 'react';
import { Status, Color } from '@atlaskit/status/element';
import { gridSize } from '@atlaskit/theme';
import styled from 'styled-components';

import { statusCatecoryColorMap } from './Icon';

interface Props {
  name: string;
  statusCategory: { id: string };
}

const StatusInParagraph = ({
  text,
  color,
}: {
  text: string;
  color: Color;
}): ReactElement => (
  <p>
    <Status text={text} color={color} />
  </p>
);

const StatusComponent: React.FC<Props> = ({ name, statusCategory }) => {
  const color = statusCatecoryColorMap[statusCategory.id];
  return (
    <div>
      <h6>STATUS</h6>
      <Wrapper>
        <StatusInParagraph text={name} color={color} />
      </Wrapper>
    </div>
  );
};

export default StatusComponent;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Wrapper = styled.div`
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
`;
