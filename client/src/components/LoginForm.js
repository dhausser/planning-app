import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';


const openRequestedPopup = () => {
  const url = `${process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_URL
    : 'http://localhost:4000'}/auth/provider`;

  // eslint-disable-next-line no-restricted-globals
  const { width, height } = screen;

  const windowHeight = 450;
  const windowWidth = 650;

  const left = (width / 2) - (windowWidth / 2);
  const top = (height / 2) - (windowHeight / 2);

  return window.open(url, '_blank', `width=${windowWidth}, height=${windowHeight}, top=${top}, left=${left}`);
};

function LoginForm({ login }) {
  const actions = [
    { text: 'Login', onClick: openRequestedPopup },
  ];

  /**
   * TODO: This is not the best way to handle redirect callback
   */
  // useEffect(() => {
  //   if (window.location.pathname === '/login') {
  //     login();
  //   }
  // }, [login]);


  return (
    <ModalTransition>
      <Modal
        actions={actions}
        heading="Login 👋"
      >
        <p>Please log in with your Atlassian user profile.</p>
      </Modal>
    </ModalTransition>
  );
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
