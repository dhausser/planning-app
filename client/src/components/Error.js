import React from 'react'
import PropTypes from 'prop-types'
import EmptyState from '@atlaskit/empty-state'

export default function Error({ name, message }) {
  return <EmptyState header={name} description={message} />
}

Error.propTypes = {
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
}
