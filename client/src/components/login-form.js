import React from "react"
import Modal, { ModalTransition } from "@atlaskit/modal-dialog"
import { port } from "../apollo/client"

export default () => {
  const actions = [
    {
      text: "Login",
      onClick: () =>
        window.open(`http://localhost:${port}/auth/provider`, "_blank"),
    },
  ]

  return (
    <ModalTransition>
      <Modal actions={actions} heading="Login 👋">
        <p>Please log in with your Atlassian user profile.</p>
      </Modal>
    </ModalTransition>
  )
}
