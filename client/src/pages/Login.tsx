import React, { FunctionComponent } from 'react';
import { Router } from '@reach/router';
import { LoginForm } from '../components';
import LoginSuccess from './LoginSuccess';

const LoginRouter: FunctionComponent = () => (
  <Router>
    <LoginForm default />
    <LoginSuccess path="login" />
  </Router>
);

export default LoginRouter;
