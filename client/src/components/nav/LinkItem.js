import React from 'react';
import { Location, Link } from '@reach/router';

const LinkItem = ({ components: { Item }, to, ...props }) => {
  return (
    <Location
      render={({ location: { pathname } }) => (
        <Item
          component={({ children, className }) => (
            <Link className={className} to={to}>
              {children}
            </Link>
          )}
          isSelected={pathname === to}
          {...props}
        />
      )}
    />
  );
};

export default LinkItem;
