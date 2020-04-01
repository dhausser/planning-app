import React, { FunctionComponent } from 'react';
import Spinner from '@atlaskit/spinner';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Loading: FunctionComponent = () => (
  <Wrapper>
    <Spinner size="large" />
  </Wrapper>
);

export default Loading;
