import React, { ReactElement } from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, rows } from './utils';
import { ResourceTableProps } from '../../types';

function ResourceTable({
  resources,
  setSelection,
  setIsEditOpen,
  setIsDeleteOpen,
  loading,
  rowsPerPage,
}: ResourceTableProps): ReactElement {
  return (
    <DynamicTable
      caption={`${resources.length} people`}
      head={head}
      rows={rows({ resources, setSelection, setIsEditOpen, setIsDeleteOpen })}
      rowsPerPage={rowsPerPage}
      loadingSpinnerSize="large"
      isLoading={loading}
      isFixedSize
      defaultSortKey="name"
      defaultSortOrder="ASC"
    />
  );
}

export default ResourceTable;
