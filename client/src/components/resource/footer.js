import React from 'react';
import PropTypes from 'prop-types';
import { ModalFooter } from '@atlaskit/modal-dialog';
import Button, { ButtonGroup } from '@atlaskit/button';

const Footer = ({ setIsOpen }) => (
  <ModalFooter>
    <span />
    <ButtonGroup>
      <Button appearance="primary" type="submit">Submit</Button>
      <Button appearance="default" type="close" onClick={() => setIsOpen(false)}>Close</Button>
    </ButtonGroup>
  </ModalFooter>
);

Footer.propTypes = {
  setIsOpen: PropTypes.bool.isRequired,
};

export default Footer;
