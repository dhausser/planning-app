import React from 'react';
import { ApolloProvider as LegacyProvider } from 'react-apollo';
import { ApolloProvider } from '@apollo/react-hooks';
import { NavigationProvider } from '@atlaskit/navigation-next';
import '@atlaskit/css-reset';
import client from './apollo';
import Router from './Router';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <LegacyProvider client={client}>
        <NavigationProvider>
          <Router />
        </NavigationProvider>
      </LegacyProvider>
    </ApolloProvider>
  );
}
