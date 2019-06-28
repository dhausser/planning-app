import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Page from '@atlaskit/page';
import { gridSize } from '@atlaskit/theme';

export const Padding = styled.div`
  margin: ${gridSize() * 4}px ${gridSize() * 8}px;
  padding-bottom: ${gridSize() * 3}px;
`;

export const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`;

export const AvatarWrapper = styled.div`
  margin-right: 8px;
`;

function PaddedPage({ children }) {
  return (
    <Page>
      <Padding>
        {children}
      </Padding>
    </Page>
  );
}

PaddedPage.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PaddedPage;
