import React from 'react';
import { Router } from '@reach/router';
import { LoginForm } from '../components';
import LoginSuccess from './login-success';

export default () => (
  <Router>
    <LoginForm default />
    <LoginSuccess path="login" />
  </Router>
);
