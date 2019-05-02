import React, { Component } from 'react'

export default class LoginForm extends Component {
  state = { email: '' }

  onChange = event => {
    const email = event.target.value
    this.setState(s => ({ email }))
  }

  onSubmit = event => {
    event.preventDefault()
    this.props.login({ variables: { email: this.state.email } })
  }

  render() {
    return <button type="submit">Log in</button>
  }
}
