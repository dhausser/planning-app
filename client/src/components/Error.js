import React from 'react'
import EmptyState from '@atlaskit/empty-state'

export default ({ error }) => (
  <EmptyState key={error} header="Error" description={error.message} />
)
