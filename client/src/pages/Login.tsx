import React from 'react';
import { Router } from '@reach/router';
import { LoginForm } from '../components';
import LoginSuccess from './LoginSuccess';

export default () => (
  <Router>
    <LoginForm default />
    <LoginSuccess path="login" />
  </Router>
);
