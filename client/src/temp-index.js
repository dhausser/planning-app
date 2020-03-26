import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import '@atlaskit/css-reset';
import Page from '@atlaskit/page';
import { Timeline } from './components';

const Padding = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 40px;
  box-sizing: border-box; 
  height: 100vh;
`;

ReactDOM.render(
  <Page>
    <Padding>
      <Timeline />
    </Padding>
  </Page>,
  document.getElementById('root'),
);