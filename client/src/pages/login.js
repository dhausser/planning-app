import React, { Fragment } from 'react'
import Router from "@reach/router";
import LoginSuccess from './LoginSuccess'
import LoginForm from "../components/LoginForm";

export default () => (
  <Router primary={false} component={Fragment}>
    <LoginForm />
    <LoginSuccess path="login" />
  </Router>
)
