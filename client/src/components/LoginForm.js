import React, { useState } from 'react'

export default function LoginForm(props) {
  const [email, setEmail] = useState('')

  const onChange = event => {
    setEmail(event.target.value)
  }

  const onSubmit = event => {
    event.preventDefault()
    props.login({ variables: { email } })
  }

  return <button type="submit">Log in</button>
}
