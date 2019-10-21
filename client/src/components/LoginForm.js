import React from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';


// let windowObjectReference;
/**
 * TODO: https://developer.mozilla.org/en-US/docs/Web/API/Window/open
 */
// const strWindowFeatures = 'height=450,width=650,centerscreen=yes';

// const openRequestedPopup = () => {
//   const link = `
//     ${process.env.NODE_ENV === 'production'
//     ? process.env.REACT_APP_URL
//     : 'http://localhost:4000'}/auth/provider`;
//   windowObjectReference = window.open(link, '_blank', strWindowFeatures);
// };

// const onSubmit = () => {
//   openRequestedPopup();
//   console.log(windowObjectReference);
//   // window.location.replace(link);
// };


function LoginForm({ login }) {
  const actions = [
    { text: 'Secondary Action', onClick: login },
  ];

  /**
   * TODO: This is not the best way to handle redirect callback
   */
  // useEffect(() => {
  // if (window.location.pathname === '/login') {
  //   login();
  // }
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
