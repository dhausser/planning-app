import React from 'react'
import { Link, Route } from 'react-router-dom'

export default ({ components: { Item }, to, ...props }) => (
  <Route
    render={({ location: { pathname } }) => (
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
  />
)
