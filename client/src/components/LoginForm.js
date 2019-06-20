import React, { useState, useEffect } from 'react'
import Modal, { ModalTransition } from '@atlaskit/modal-dialog'

export default ({ login }) => {
  const [actions, setActions] = useState()
  const token = localStorage.getItem('token')

  useEffect(() => {
    function getAccessToken() {
      const url = new URL(window.location)
      const searchParams = new URLSearchParams(url.search)
      try {
        window.history.replaceState(null, null, window.location.pathname)
        const param = searchParams.get('token')
        login({ variables: { token: param } })
      } catch (error) {
        console.error(error)
      }
    }

    if (window.location.search) {
      getAccessToken()
    }

    if (!token) {
      setActions([
        {
          text: 'Login with Jira',
          onClick: () => window.location.replace(`http://localhost:4000/login`),
        },
      ])
    }
  }, [login, token])

  return (
    <>
      {token ? (
        <p>Welcome! Here is your access token: {token}</p>
      ) : (
        <ModalTransition>
          <Modal actions={actions} heading="Hi there 👋">
            <p>
              In order to proceed please authorise this app to access your Jira
              data
            </p>
          </Modal>
        </ModalTransition>
      )}
    </>
  )
}
