import React, { FunctionComponent } from 'react';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
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

export const ButtonLoading = () => (
  <Button key="filters" isLoading appearance="subtle">
    Filters
  </Button>
);

const Loading: FunctionComponent = () => {
  return (
    <Wrapper>
      <Spinner size="large" />
    </Wrapper>
  );
};

export default Loading;
