import React from 'react';
import RefinementBar, { SearchFilter } from '@atlaskit/refinement-bar';

export default () => (
  <div style={{ padding: 20 }}>
    <RefinementBar
      fieldConfig={{ search: { label: 'Search', type: SearchFilter } }}
      irremovableKeys={['search']}
      onChange={() => {}}
      value={{ search: '' }}
    />
  </div>
);
