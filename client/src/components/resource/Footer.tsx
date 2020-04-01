import React, { ReactElement } from 'react';
import { ModalFooter } from '@atlaskit/modal-dialog';
import Button, { ButtonGroup } from '@atlaskit/button';
import { ModalInterfaceProps } from './types';

const Footer = ({ setIsOpen }: ModalInterfaceProps): ReactElement => (
  <ModalFooter>
    <span />
    <ButtonGroup>
      <Button appearance="primary" type="submit">
        Submit
      </Button>
      <Button
        appearance="default"
        type="close"
        onClick={(): void => setIsOpen(false)}
      >
        Close
      </Button>
    </ButtonGroup>
  </ModalFooter>
);

export default Footer;
