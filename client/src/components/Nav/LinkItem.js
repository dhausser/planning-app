import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';

function LinkItem({ components: { Item }, to, ...props }) {
  return (
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
  );
}

LinkItem.propTypes = {
  components: PropTypes.arrayOf(PropTypes.func).isRequired,
  to: PropTypes.objectOf(PropTypes.string).isRequired,
};
