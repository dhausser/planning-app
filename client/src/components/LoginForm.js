import React, { useEffect } from 'react'
import Modal, { ModalTransition } from '@atlaskit/modal-dialog'

const authUrl =
  `http://localhost:4000/auth/provider` ||
  `https://roadmap.cdprojektred.com/auth/provider`

export default ({ login }) => {
  useEffect(() => {
    function getAccessToken() {
      try {
        window.history.replaceState(null, null, window.location.pathname)
        login()
      } catch (error) {
        console.error(error)
      }
    }

    if (window.location.search) {
      getAccessToken()
    }
  }, [login])

  const actions = [
    {
      text: 'Login with Jira',
      onClick: () => window.location.replace(authUrl),
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
