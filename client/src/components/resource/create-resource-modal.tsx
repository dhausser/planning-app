import React from 'react';
import { useMutation, gql } from '@apollo/client';
import ModalDialog from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import AssignableUserPicker from './assignable-user-picker';
import TeamPicker from './team-picker';
import Footer from './footer';
import { ModalInterfaceProps, ResourceForm } from './types';

const INSERT_RESOURCE = gql`
  mutation InsertResource(
    $id: ID!
    $firstname: String!
    $lastname: String!
    $email: String!
    $team: String!
  ) {
    insertResource(
      id: $id
      firstname: $firstname
      lastname: $lastname
      email: $email
      team: $team
    ) {
      key
    }
  }
`;

export default function CreateResourceModal({
  setIsOpen,
}: ModalInterfaceProps) {
  const [insertResource] = useMutation(INSERT_RESOURCE, {
    onCompleted: ({ key }) => {
      console.log(`Successfully created resource: ${key}`);
    },
  });

  return (
    <ModalDialog
      heading="Create"
      scrollBehavior="outside"
      onClose={() => setIsOpen(false)}
      components={{
        Container: ({ children, className }) => (
          <Form<ResourceForm>
            onSubmit={({ firstname, lastname, email, team }) => {
              const id = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
              insertResource({
                variables: {
                  id,
                  firstname,
                  lastname,
                  email,
                  team: team.value,
                },
              });
              setIsOpen(false);
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
      <Field label="Assignee" name="assignee" defaultValue="" isRequired>
        {() => <AssignableUserPicker />}
      </Field>
      <Field label="Team" name="team" defaultValue="" isRequired>
        {() => <TeamPicker />}
      </Field>
    </ModalDialog>
  );
}
