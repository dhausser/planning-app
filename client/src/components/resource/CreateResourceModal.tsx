import React, { ReactElement } from 'react';
import { useMutation, gql } from '@apollo/client';
import ModalDialog from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import AssignableUserPicker from './AssignableUserPicker';
import TeamPicker from './TeamPicker';
import Footer from './Footer';
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

const CreateResourceModal = ({
  setIsOpen,
}: ModalInterfaceProps): ReactElement => {
  const [insertResource] = useMutation(INSERT_RESOURCE, {
    onCompleted: ({ key }) => {
      // eslint-disable-next-line no-console
      console.log(`Successfully created resource: ${key}`);
    },
  });

  return (
    <ModalDialog
      heading="Create"
      scrollBehavior="outside"
      onClose={(): void => setIsOpen(false)}
      components={{
        // eslint-disable-next-line react/display-name
        Container: ({ children, className }): ReactElement => (
          <Form<ResourceForm>
            onSubmit={({ firstname, lastname, email, team }): void => {
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
      <Field label="Assignee" name="assignee" defaultValue="" isRequired>
        {(): React.ReactNode => <AssignableUserPicker />}
      </Field>
      <Field label="Team" name="team" defaultValue="" isRequired>
        {(): React.ReactNode => <TeamPicker />}
      </Field>
    </ModalDialog>
  );
};

export default CreateResourceModal;
