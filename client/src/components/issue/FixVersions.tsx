import React from 'react';
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme';
import Lozenge from '@atlaskit/lozenge';
import { FixVersion } from '../../types';

interface Props {
  fixVersions: FixVersion[];
}

const Wrapper = styled.div`
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
`;

const FixVersions: React.FC<Props> = ({ fixVersions }) => {
  const [fixVersion] = fixVersions;
  return (
    <>
      <h6>Fix Versions</h6>
      {fixVersion && (
        <Wrapper>
          <Lozenge appearance="default">{fixVersion.name}</Lozenge>
        </Wrapper>
      )}
    </>
  );
};

export default FixVersions;
