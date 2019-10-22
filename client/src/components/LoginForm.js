import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'apollo-boost';

import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const openRequestedPopup = () => {
  const url = `${process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_URL
    : 'http://localhost:4000'}/auth/provider`;

  // eslint-disable-next-line no-restricted-globals
  const { width, height } = screen;

  const windowWidth = 1080;
  const windowHeight = 720;

  const left = (width / 2) - (windowWidth / 2);
  const top = (height / 12);

  return window.open(url, '_blank', `width=${windowWidth}, height=${windowHeight}, top=${top}, left=${left}`);
};

function LoginForm({ login }) {
  const [isOpen, setIsOpen] = useState(true);

  const actions = [
    { text: 'Login', onClick: openRequestedPopup },
    // { text: 'Close', onClick: () => { setIsOpen(false); } },
  ];

  /**
   * TODO:
   * 1. Launch the login mutation on click
   * 2. Mutation resolver await for authentication token to be available with a timeout limit
   * 3. onCompleted closes the login popup window and triggers a update to logged in state
   */

  // useEffect(() => {
  //   if (window.location === '/fallback' || user.isLoggedIn) {
  //     console.log('Falling back!');
  //     setIsOpen(false);
  //   }
  // }, [user, location]);

  return (
    <ModalTransition>
      {isOpen
        && (
        <Modal actions={actions} heading="Login 👋">
          <p>Please log in with your Atlassian user profile.</p>
        </Modal>
        )}
    </ModalTransition>
  );
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
