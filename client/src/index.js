import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider as LegacyProvider } from 'react-apollo';
import { ApolloProvider } from '@apollo/react-hooks';
import { NavigationProvider } from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';

import client from './apollo';
import App from './App';

render(
  <ApolloProvider client={client}>
    <LegacyProvider client={client}>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </LegacyProvider>
  </ApolloProvider>,
  document.getElementById('root'),
);
