import React from 'react';
import { Router } from '@reach/router';
import LoginSuccess from './LoginSuccess';
import LoginForm from '../components/LoginForm';

export default () => (
  <Router>
    <LoginForm default />
    <LoginSuccess path="login" />
  </Router>
);
