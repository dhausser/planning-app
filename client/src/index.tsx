import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { ApolloProvider } from '@apollo/client';
import { NavigationProvider } from '@atlaskit/navigation-next';
import Page from '@atlaskit/page';
import '@atlaskit/css-reset';
import App from './App';
import * as serviceWorker from './serviceWorker';

import client from './apolloClient';
import { Timeline } from './components';

const Padding = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 40px;
  box-sizing: border-box;
  height: 100vh;
`;

if (process.env.NODE_ENV === 'development') {
  ReactDOM.render(
    <Page>
      <Padding>
        <Timeline />
      </Padding>
    </Page>,
    document.getElementById('root')
  );
} else {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </ApolloProvider>,
    document.getElementById('root')
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
