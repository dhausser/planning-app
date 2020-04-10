import React, { ReactElement, Dispatch, SetStateAction } from 'react';
import { ModalFooter } from '@atlaskit/modal-dialog';
import Button, { ButtonGroup } from '@atlaskit/button';

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Footer = ({ setIsOpen }: Props): ReactElement => (
  <ModalFooter>
    <span />
    <ButtonGroup>
      <Button
        appearance="default"
        type="close"
        onClick={(): void => setIsOpen(false)}
      >
        Close
      </Button>
      <Button appearance="primary" type="submit">
        Submit
      </Button>
    </ButtonGroup>
  </ModalFooter>
);

export default Footer;
