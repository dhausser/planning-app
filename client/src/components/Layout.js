import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Page from '@atlaskit/page';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 40px;
  box-sizing: border-box; 
  height: 100vh;
`;

export default function Layout({ children }) {
  return (
    <Page>
      <Wrapper>{children}</Wrapper>
    </Page>
  );
}

Layout.defaultProps = {
  children: null,
};

Layout.propTypes = {
  children: PropTypes.node,
};
