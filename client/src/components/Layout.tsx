import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Page from '@atlaskit/page';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 40px;
  box-sizing: border-box;
  height: 100vh;
`;

const Layout: FunctionComponent = ({ children }) => (
  <Page>
    <Wrapper>{children}</Wrapper>
  </Page>
);

export default Layout;
