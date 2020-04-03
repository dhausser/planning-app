import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { NavigationProvider } from '@atlaskit/navigation-next';
import App from './App';
import client from './apollo';

// import styled from 'styled-components';
// import '@atlaskit/css-reset';
// import Page from '@atlaskit/page';
// import { Timeline } from './components';

// const Padding = styled.div`
//   display: flex;
//   flex-direction: column;
//   padding: 0px 0px 0px 40px;
//   box-sizing: border-box;
//   height: 100vh;
// `;

// ReactDOM.render(
//   <Page>
//     <Padding>
//       <Timeline />
//     </Padding>
//   </Page>,
//   document.getElementById('root')
// );

ReactDOM.render(
  <ApolloProvider client={client}>
    <NavigationProvider>
      <App />
    </NavigationProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
