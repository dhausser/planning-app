import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';

import { RouteComponentProps } from '@reach/router';
import Button from '@atlaskit/button';
import DynamicTable from '@atlaskit/dynamic-table';
import EmptyState from '@atlaskit/empty-state';

import { GET_ISSUES, ROWS_PER_PAGE } from './useIssues';
import { Loading } from '..';
import { head, row } from './utils';

interface IssueTableProps extends RouteComponentProps {
  resourceId?: string;
}

const IssueTable: React.FC<IssueTableProps> = ({ resourceId }) => {
  const [length, setLength] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const {
    loading, error, data, fetchMore,
  } = useQuery(GET_ISSUES, {
    variables: {
      resourceId,
      maxResults: ROWS_PER_PAGE,
    },
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
          data
          && data.issues
          && data.issues.issues
          && data.issues.issues.map(row)
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
      {data
        && data.issues
        && data.issues.total > length
        && (isLoadingMore ? (
          <Loading />
        ) : (
          <Wrapper>
            <Button
              onClick={
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                async () => {
                  setIsLoadingMore(true);
                  await fetchMore({
                    variables: { start: length },
                  });
                  setIsLoadingMore(false);
                }
                // fetchMore({
                //   variables: { startAt: length },
                //   updateQuery: (prev, { fetchMoreResult }) => {
                //     if (!fetchMoreResult) return prev;
                //     return {
                //       ...fetchMoreResult,
                //       issues: {
                //         ...fetchMoreResult.issues,
                //         issues: [
                //           ...prev.issues.issues,
                //           ...fetchMoreResult.issues.issues,
                //         ],
                //       },
                //     };
                //   },
                // })
              }
            >
              Load More
            </Button>
          </Wrapper>
        ))}
    </>
  );
};

export default IssueTable;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 1.5em;
`;
