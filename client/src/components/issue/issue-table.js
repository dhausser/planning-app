import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import DynamicTable from '@atlaskit/dynamic-table';
import EmptyState from '@atlaskit/empty-state';
import { LoadButton } from '..';
import { GET_ISSUES, ROWS_PER_PAGE } from './useIssues';
import { head, row } from './utils';

const IssueTable = () => {
  const [length, setLength] = useState(0);
  const { loading, error, data, fetchMore } = useQuery(GET_ISSUES, {
    variables: { maxResults: ROWS_PER_PAGE },
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
          data.issues.issues.map(row)
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
      {data && data.issues && data.issues.total > length && (
        <LoadButton fetchMore={fetchMore} startAt={length} />
      )}
    </>
  );
};

export default IssueTable;
