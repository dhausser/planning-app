import React, { useEffect } from 'react'
import Modal, { ModalTransition } from '@atlaskit/modal-dialog'

export default ({ login }) => {
  // const token = localStorage.getItem('token')

  // useEffect(() => {
  //   function getAccessToken() {
  //     const url = new URL(window.location)
  //     const searchParams = new URLSearchParams(url.search)
  //     try {
  //       window.history.replaceState(null, null, window.location.pathname)
  //       const param = searchParams.get('token')
  //       login({ variables: { token: param } })
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }

  //   if (window.location.search) {
  //     getAccessToken()
  //   }
  // }, [login])

  const actions = [
    {
      text: 'Login with Jira',
      onClick: () =>
        window.location.replace(`http://localhost:4000/auth/provider`),
    },
  ]

  return (
    <ModalTransition>
      <Modal actions={actions} heading="Hi there 👋">
        <p>
          In order to proceed please authorise this app to access your Jira data
        </p>
      </Modal>
    </ModalTransition>
  )
}
