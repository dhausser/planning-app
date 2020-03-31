import React from 'react';
import { Location, Link, RouteComponentProps } from '@reach/router';

interface ItemProps extends React.FunctionComponent {
  children?: React.ReactNode;
  component: React.ReactNode;
  className: string;
}

interface Props extends RouteComponentProps {
  components: { Item: ItemProps; }
  to: string;
}

const LinkItem: React.FC<Props> = ({ components: { Item }, to, ...props }) => (
  <Location>
    {({ location: { pathname } }) => (
      // @ts-ignore
      <Item component={({ children, className }: ItemProps) => (
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
