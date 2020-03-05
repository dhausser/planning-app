import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, gql } from '@apollo/client';
import ModalDialog from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import AssignableUserPicker from './AssignableUserPicker';
import TeamPicker from './TeamPicker';
import Footer from './Footer';

const INSERT_RESOURCE = gql`
  mutation InsertResource($id: ID!, $firstname: String!, $lastname: String!, $email: String!, $team: String!) {
    insertResource(id: $id, firstname: $firstname, lastname: $lastname, email: $email, team: $team) {
      key
    }
  }
`;

export default function CreateResourceModal({ setIsOpen }) {
  const [insertResource] = useMutation(INSERT_RESOURCE, {
    // eslint-disable-next-line no-console
    onCompleted: ({ key }) => { console.log(`Successfully created resource: ${key}`); },
  });

  return (
    <ModalDialog
      heading="Create"
      scrollBehavior="outside"
      onClose={() => setIsOpen(false)}
      components={{
        // eslint-disable-next-line react/prop-types
        Container: ({ children, className }) => (
          <Form onSubmit={(formData) => {
            const {
              firstname, lastname, email, team: { value },
            } = formData;
            const id = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
            insertResource({
              variables: {
                id, firstname, lastname, email, team: value,
              },
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
      <Field label="Assignee" name="assignee" defaultValue="" placeholder="Assignee" isRequired>
        {({ fieldProps }) => <AssignableUserPicker fieldProps={fieldProps} />}
      </Field>
      <Field label="Team" name="team" defaultValue="" placeholder="Team" isRequired>
        {({ fieldProps }) => (
          <>
            <TeamPicker fieldProps={fieldProps} />
          </>
        )}
      </Field>
      {/* <Footer setIsOpen={setIsOpen} /> */}
    </ModalDialog>
  );
}

CreateResourceModal.propTypes = {
  setIsOpen: PropTypes.bool.isRequired,
  // children: PropTypes.element.isRequired,
  // className: PropTypes.string.isRequired,
};
