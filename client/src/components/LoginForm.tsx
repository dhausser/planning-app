import React, { ReactElement } from 'react';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

const openRequestedPopup = (): Window | null => {
  const devEndpoint = process.env.REACT_APP_DEV_ENDPOINT;
  const prodEndpoint = process.env.REACT_APP_PROD_ENDPOINT;

  const url: string | undefined =
    process.env.NODE_ENV === 'production' ? prodEndpoint : devEndpoint;

  // eslint-disable-next-line no-restricted-globals
  const { width, height } = screen;

  const windowWidth = 800;
  const windowHeight = 500;

  const left: number = width / 2 - windowWidth / 2;
  const top: number = height / 12;

  return window.open(
    url,
    '_blank',
    `width=${windowWidth}, height=${windowHeight}, top=${top}, left=${left}`
  );
};

function LoginForm(): ReactElement {
  const actions = [{ text: 'Login', onClick: openRequestedPopup }];

  return (
    <ModalTransition>
      <Modal actions={actions} heading="Login 👋">
        <p>Please log in with your Atlassian user profile.</p>
      </Modal>
    </ModalTransition>
  );
}

export default LoginForm;
