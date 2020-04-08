import React, { ReactElement } from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import { head, rows } from './utils';
import { Resource } from '../../types';

interface Props {
  resources: Array<Resource>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  rowsPerPage: number;
}

function ResourceTable({
  resources,
  setIsEditOpen,
  setIsDeleteOpen,
  loading,
  rowsPerPage,
}: Props): ReactElement {
  return (
    <DynamicTable
      caption={`${resources.length} people`}
      head={head}
      rows={rows(resources, setIsEditOpen, setIsDeleteOpen)}
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
