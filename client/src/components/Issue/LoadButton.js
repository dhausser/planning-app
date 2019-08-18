import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from '@atlaskit/button';

export default function LoadButton({ setStartAt, fetchMore, startAt, maxResults }) {
  return (
    <Wrapper>
      <Button
        onClick={() => {
          setStartAt(startAt + maxResults);
          return fetchMore({
            variables: { startAt },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                ...fetchMoreResult,
                issues: {
                  ...fetchMoreResult.issues,
                  issues: [
                    ...prev.issues.issues,
                    ...fetchMoreResult.issues.issues,
                  ],
                },
              };
            },
          });
        }}
      >
        Load More
      </Button>
    </Wrapper>
  );
}

LoadButton.propTypes = {
  setStartAt: PropTypes.func.isRequired,
  fetchMore: PropTypes.func.isRequired,
  startAt: PropTypes.number.isRequired,
  maxResults: PropTypes.number.isRequired,
};

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 1.5em;
`;