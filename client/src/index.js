import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import '@atlaskit/css-reset';

import AppRouter from './AppRouter';
import client from './apollo';

const App = () => (
  <ApolloProvider client={client}>
    <AppRouter />
  </ApolloProvider>
);

render(<App />, document.getElementById('root'));
