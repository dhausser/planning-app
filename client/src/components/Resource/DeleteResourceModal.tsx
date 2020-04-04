import React, { ReactElement } from 'react';
import { useMutation, gql } from '@apollo/client';
import ModalDialog from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Footer from './Footer';
import { ModalInterfaceProps } from './types';

const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id) {
      key
    }
  }
`;

const DeleteResourceModal = ({
  setIsOpen,
}: ModalInterfaceProps): ReactElement => {
  const [deleteResource] = useMutation(DELETE_RESOURCE);

  return (
    <ModalDialog
      heading="Delete"
      onClose={(): void => setIsOpen(false)}
      components={{
        // eslint-disable-next-line react/display-name
        Container: ({ children, className }): ReactElement => (
          <Form
            onSubmit={(data): void => {
              deleteResource({ variables: { ...data } });
              setIsOpen(false);
            }}
          >
            {({ formProps }): ReactElement => (
              <form {...formProps} className={className}>
                {children}
              </form>
            )}
          </Form>
        ),
        // eslint-disable-next-line react/display-name
        Footer: (): ReactElement => <Footer setIsOpen={setIsOpen} />,
      }}
    >
      <p>Are you sure want to delete this resource?</p>
      <Field label="Email" name="email" defaultValue="" isRequired>
        {({ fieldProps }): React.ReactNode => (
          <TextField placeholder="gerald@cdprojektred.com" {...fieldProps} />
        )}
      </Field>
    </ModalDialog>
  );
};

export default DeleteResourceModal;
