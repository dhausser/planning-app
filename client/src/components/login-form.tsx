import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

const openRequestedPopup = () => {
  const devEndpoint: string = 'http://localhost:4000/auth/provider';
  const prodEndpoint: string = 'https://roadmap.cdprojektred.com/auth/provider';

  const url: string =
    process.env.NODE_ENV === 'production' ? prodEndpoint : devEndpoint;

  // eslint-disable-next-line no-restricted-globals
  const { width, height } = screen;

  const windowWidth: number = 1080;
  const windowHeight: number = 720;

  const left: number = width / 2 - windowWidth / 2;
  const top: number = height / 12;

  return window.open(
    url,
    '_blank',
    `width=${windowWidth}, height=${windowHeight}, top=${top}, left=${left}`,
  );
};

// function LoginForm() {
const LoginForm: FunctionComponent<RouteComponentProps> = () => {
  const actions = [{ text: 'Login', onClick: openRequestedPopup }];

  /**
   * TODO:
   * 1. Launch the login mutation on click
   * 2. Mutation resolver await for authentication token to be available with a timeout limit
   * 3. onCompleted closes the login popup window and triggers a update to logged in state
   */

  return (
    <ModalTransition>
      <Modal actions={actions} heading="Login 👋">
        <p>Please log in with your Atlassian user profile.</p>
      </Modal>
    </ModalTransition>
  );
};

export default LoginForm;
