import React, { ReactElement, FunctionComponent } from 'react';
import { Route, Link, RouteComponentProps } from 'react-router-dom';

interface ItemProps extends React.FunctionComponent {
  children?: React.ReactNode;
  component: RouteComponentProps;
  className: string;
}

interface Props extends RouteComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: any;
  to: string;
}

const LinkItem: FunctionComponent<Props> = ({
  components: { Item },
  to,
  ...props
}) => (
  <Route>
    {({ location: { pathname } }): JSX.Element => (
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
  </Route>
);

export default LinkItem;
