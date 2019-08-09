import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme';
import Lozenge from '@atlaskit/lozenge';

const Wrapper = styled.div`
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
`;

export default function FixVersions({ fixVersions }) {
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
}

FixVersions.propTypes = {
  fixVersions: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};
