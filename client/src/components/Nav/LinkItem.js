import React from 'react'
import PropTypes from 'prop-types'
import { Location, Link } from '@reach/router'

function LinkItem({ components: { Item }, to, ...props }) {
  return (
    <Location>
      { ({ location: { pathname } }) => (
        <Item
          component={({ children, className }) => (
            <Link css={{ color: '#DEEBFF' }} className={className} to={to}>
              {children}
            </Link>
          )}
          isSelected={pathname === to}
          {...props}
        />
      )}
    </Location>
  )
}

LinkItem.propTypes = {
  components: PropTypes.objectOf(PropTypes.func).isRequired,
  to: PropTypes.string.isRequired,
}

export default LinkItem
