import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Form from '@atlaskit/form';
import Button from '@atlaskit/button';

function LoginForm({ login }) {
  const onSubmit = () => {
    window.location.replace(`
    ${process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_URL
    : 'http://localhost:4000'}/auth/provider`);
  };

  useEffect(() => {
    if (window.location.pathname === '/login') {
      login();
    }
  }, [login]);

  return (
    <ModalTransition>
      <Modal heading="Hi there 👋">
        <Form onSubmit={onSubmit}>
          {({ formProps }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <form {...formProps}>
              <Button type="submit" appearance="primary">
                Jira Login
              </Button>
            </form>
          )}
        </Form>
      </Modal>
    </ModalTransition>
  );
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
