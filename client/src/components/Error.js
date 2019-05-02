import React from 'react'
import EmptyState from '@atlaskit/empty-state'

export default ({ error }) => (
  <EmptyState header="Error" description={error.message} />
)
