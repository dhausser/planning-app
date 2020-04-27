import React, { useState, useEffect, ReactElement } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';

import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import EmptyState from '@atlaskit/empty-state';

import { GET_ISSUES, ROWS_PER_PAGE } from '../../lib/useIssues';
import { head, getRows } from './utils';
import { IssueConnectionData, IssueConnectionVars } from '../../types';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 1.5em;
`;

function IssueTable({ resourceId }: { resourceId?: string }): ReactElement {
  const [length, setLength] = useState(0);
  const { loading, error, data, fetchMore } = useQuery<
    IssueConnectionData,
    IssueConnectionVars
  >(GET_ISSUES, {
    variables: {
      resourceId,
      startAt: 0,
      maxResults: ROWS_PER_PAGE,
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data && data.issues && data.issues.issues.length) {
      setLength(data.issues.issues.length);
    }
  }, [data]);

  return (
    <>
      <DynamicTable
        head={head}
        rows={
          data &&
          data.issues &&
          data.issues.issues &&
          getRows(data.issues.issues)
        }
        rowsPerPage={ROWS_PER_PAGE}
        loadingSpinnerSize="large"
        isLoading={loading}
        isFixedSize
        defaultSortKey="priority"
        defaultSortOrder="ASC"
        isRankable
        emptyView={
          error && (
            <EmptyState header={error.name} description={error.message} />
          )
        }
      />
      <ButtonWrapper>
        <Button
          onClick={async () => {
            await fetchMore({
              variables: {
                resourceId,
                startAt: length,
                maxResult: ROWS_PER_PAGE,
              },
              updateQuery: (prev: any, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
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
      </ButtonWrapper>
    </>
  );
}

export default IssueTable;
