import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { NavigationProvider } from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import App from './App';
import client from './apollo';

render(
  <ApolloProvider client={client}>
    <NavigationProvider><App /></NavigationProvider>
  </ApolloProvider>, document.getElementById('root'),
);
