import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Page from '@atlaskit/page';

const Padding = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0px 0px 0px 40px;
  height: 100vh;
  overflow: hidden;
`;

export default function Layout({ children }) {
  return (
    <Page>
      <Padding>{children}</Padding>
    </Page>
  );
}

Layout.defaultProps = {
  children: null,
};

Layout.propTypes = {
  children: PropTypes.node,
};
