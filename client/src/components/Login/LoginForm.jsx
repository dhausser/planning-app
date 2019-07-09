import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

function LoginForm({ login }) {
  useEffect(() => {
    if (window.location.pathname === '/login') {
      login();
    }
  }, [login]);

  const actions = [
    {
      text: 'Login with Jira',
      onClick: () => window.location.replace(
        `${process.env.NODE_ENV === 'production'
          ? process.env.REACT_APP_URL : 'http://localhost:4000'}/auth/provider`,
      ),
    },
  ];

  return (
    <ModalTransition>
      <Modal actions={actions} heading="Hi there 👋">
        <p>
          In order to proceed please authorise this app to access your Jira data
        </p>
      </Modal>
    </ModalTransition>
  );
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};


export default LoginForm;
