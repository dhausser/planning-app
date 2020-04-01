import React, { ReactElement } from 'react';
import { Location, Link, RouteComponentProps } from '@reach/router';

interface ItemProps extends React.FunctionComponent {
  children?: React.ReactNode;
  component: RouteComponentProps;
  className: string;
}

interface Props extends RouteComponentProps {
  components: { Item: ItemProps };
  to: string;
}

const LinkItem: React.FC<Props> = ({ components: { Item }, to, ...props }) => (
  <Location>
    {({ location: { pathname } }): ReactElement => (
      // eslint-disable-next-line react/jsx-first-prop-new-line
      <Item
        component={({ children, className }: ItemProps): ReactElement => (
          <Link css={{ color: '#DEEBFF' }} className={className} to={to}>
            {children}
          </Link>
        )}
        isSelected={pathname === to}
        {...props}
      />
    )}
  </Location>
);

export default LinkItem;
