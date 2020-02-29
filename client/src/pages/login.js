import React, { Fragment } from 'react'
import { Router } from '@reach/router'
import { LoginSuccess } from './LoginSuccess'
import { LoginForm } from '../components'

export default () => (
  <Router primary={false} component={Fragment}>
    <LoginSuccess path="/login" />
    <LoginForm />
  </Router>
)
