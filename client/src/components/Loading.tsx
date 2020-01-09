import React from 'react';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonLoading = () => (
  <Button key="filters" isLoading appearance="subtle">
    Filters
  </Button>
);

function Loading() {
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  );
}

export default Loading;
