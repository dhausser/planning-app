import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, gql } from '@apollo/client';
import ModalDialog from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Footer from './footer';

const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id) {
      key
    }
  }
`;

export default function DeleteResourceModal({ setIsOpen }) {
  const [deleteResource] = useMutation(DELETE_RESOURCE);
  return (
    <ModalDialog
      heading="Delete"
      onClose={() => setIsOpen(false)}
      components={{
        Container: ({ children, className }) => (
          <Form onSubmit={(data) => {
            deleteResource({
              variables: { ...data },
              onComplete: () => setIsOpen(false),
            });
          }}
          >
            {({ formProps }) => (
              <form {...formProps} className={className}>
                {children}
              </form>
            )}
          </Form>
        ),
        Footer: () => <Footer setIsOpen={setIsOpen} />,
      }}
    >
      <p>Are you sure want to delete this resource?</p>
      <Field label="Email" name="email" defaultValue="" isRequired>
        {({ fieldProps }) => <TextField placeholder="gerald@cdprojektred.com" {...fieldProps} />}
      </Field>
    </ModalDialog>
  );
}

DeleteResourceModal.propTypes = {
  setIsOpen: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  className: PropTypes.string.isRequired,
};
