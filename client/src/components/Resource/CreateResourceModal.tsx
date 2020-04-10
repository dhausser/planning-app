import React, { ReactElement } from 'react';
import { useMutation, gql } from '@apollo/client';
import ModalDialog from '@atlaskit/modal-dialog';
import Form, { Field, OnSubmitHandler } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
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

function CreateResourceModal({ setIsOpen }: ModalInterfaceProps): ReactElement {
  const [insertResource] = useMutation(INSERT_RESOURCE, {
    onCompleted: ({ key }) => {
      // eslint-disable-next-line no-console
      console.log(`Successfully created resource: ${key}`);
    },
  });

  const close = (): void => setIsOpen(false);

  const onFormSubmit: OnSubmitHandler<ResourceForm> = (
    data: Record<string, any>
  ): void => {
    // const { first }
    console.log(JSON.stringify(data));
    // const key = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
    // insertResource({
    //   variables: {
    //     key,
    //     firstname,
    //     lastname,
    //     email,
    //     team: team.value,
    //   },
    // });
    setIsOpen(false);
  };

  interface ContainerProps {
    children: React.ReactNode;
    className?: string;
  }

  return (
    <ModalDialog
      heading="Create"
      scrollBehavior="outside"
      onClose={close}
      components={{
        // eslint-disable-next-line react/display-name
        Container: ({ children, className }: ContainerProps): ReactElement => (
          <Form<ResourceForm> onSubmit={onFormSubmit}>
            {({ formProps }): ReactElement => (
              <form {...formProps} className={className}>
                {children}
              </form>
            )}
          </Form>
        ),
        // eslint-disable-next-line react/display-name
        // Footer: (): ReactElement => <Footer setIsOpen={setIsOpen} />,
      }}
    >
      <p>Enter some text then submit the form to see the response.</p>
      <Field
        label="Firstname"
        name="resource-firstname"
        defaultValue=""
        isRequired
      >
        {({ fieldProps }): React.ReactNode => <TextField {...fieldProps} />}
      </Field>
      <Field
        label="Lastname"
        name="resource-lastname"
        defaultValue=""
        isRequired
      >
        {({ fieldProps }): React.ReactNode => <TextField {...fieldProps} />}
      </Field>
      <Field label="Email" name="resource-email" defaultValue="" isRequired>
        {({ fieldProps }): React.ReactNode => (
          <TextField
            autoComplete="off"
            placeholder="firstname.lastname@cdprojektred.com"
            {...fieldProps}
          />
        )}
      </Field>
      <Field label="Team" name="team" defaultValue="" isRequired>
        {(): React.ReactNode => <TeamPicker />}
      </Field>
      <Footer setIsOpen={setIsOpen} />
    </ModalDialog>
  );
}

export default CreateResourceModal;
