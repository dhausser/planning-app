import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalDialog, { ModalTransition, ModalFooter } from '@atlaskit/modal-dialog';
import Form from '@atlaskit/form';
import Button from '@atlaskit/button';

let windowObjectReference;
/**
 * TODO: https://developer.mozilla.org/en-US/docs/Web/API/Window/open
 */
const strWindowFeatures = 'height=450,width=650,centerscreen=yes';

const openRequestedPopup = () => {
  const link = `
    ${process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_URL
    : 'http://localhost:4000'}/auth/provider`;
  windowObjectReference = window.open(link, '_blank', strWindowFeatures);
};

const onSubmit = () => {
  openRequestedPopup();
  console.log(windowObjectReference);
  // window.location.replace(link);
};

const onClose = () => {
  console.log('closing...');
};

function LoginForm({ login }) {
  const footer = () => (
    <ModalFooter>
      <span />
      <Button appearance="primary" type="submit">
        Log In
      </Button>
    </ModalFooter>
  );

  /**
   * TODO: This is not the best way to handle redirect callback
   */
  useEffect(() => {
    // if (window.location.pathname === '/login') {
    //   login();
    // }
  }, [login]);

  return (
    <ModalTransition>
      <ModalDialog
        heading="Hi there 👋"
        onClose={onClose}
        components={{
          Container: ({ children, className }) => (
            <Form onSubmit={onSubmit}>
              {({ formProps }) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <form {...formProps} className={className}>
                  {children}
                </form>
              )}
            </Form>
          ),
          Footer: footer,
        }}
      >
        <p>Please log in with your Atlassian user profile.</p>
      </ModalDialog>
    </ModalTransition>
  );
}

LoginForm.propTypes = {
  className: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default LoginForm;
