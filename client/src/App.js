import React from 'react';
import { ApolloProvider as LegacyProvider } from 'react-apollo';
import { ApolloProvider } from '@apollo/react-hooks';
import { NavigationProvider } from '@atlaskit/navigation-next';
import Page from '@atlaskit/page';
import { gridSize } from '@atlaskit/theme';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import client from './apollo';
import Router from './Router';

const Padding = styled.div`
  margin: ${gridSize() * 4}px ${gridSize() * 8}px;
  padding-bottom: ${gridSize() * 3}px;
`;

export default function App() {
  return (
    <ApolloProvider client={client}>
      <LegacyProvider client={client}>
        <NavigationProvider>
          <Page>
            <Padding>
              <Router />
            </Padding>
          </Page>
        </NavigationProvider>
      </LegacyProvider>
    </ApolloProvider>
  );
}
