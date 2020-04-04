import React, { FunctionComponent } from 'react';
// import { Router } from '@reach/router';
import { Route, Switch } from 'react-router-dom';
import { LoginForm } from '../components';
import LoginSuccess from './LoginSuccess';

const LoginRouter: FunctionComponent = () => (
  <Switch>
    <Route path="/" component={LoginForm} />
    <Route path="login" component={LoginSuccess} />
  </Switch>
);

export default LoginRouter;
