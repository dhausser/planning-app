import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import Form, { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import ModalDialog from '@atlaskit/modal-dialog';
import Footer from './footer';
import { GET_TEAMS } from '../filters/team-filter';

const UPDATE_RESOURCE = gql`
  mutation UpdateResource(
    $id: ID!
    $firstname: String!
    $lastname: String!
    $email: String!
    $team: String!
  ) {
    updateResource(
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

export default function EditResourceModal({ setIsOpen }) {
  const [updateResource] = useMutation(UPDATE_RESOURCE);
  const { data } = useQuery(GET_TEAMS);
  const options =
    data &&
    data.teams &&
    data.teams.map(({ id }) => ({ label: id, value: id }));

  return (
    <ModalDialog
      heading="Edit"
      scrollBehavior="outside"
      onClose={() => setIsOpen(false)}
      components={{
        Container: ({ children, className }) => (
          <Form
            onSubmit={(formData) => {
              const {
                firstname,
                lastname,
                email,
                team: { value },
              } = formData;
              const id = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
              updateResource({
                variables: {
                  id,
                  firstname,
                  lastname,
                  email,
                  team: value,
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
      <Field
        label="Firstname"
        name="firstname"
        defaultValue="Gerald"
        placeholder="Gerald"
        isRequired
      >
        {({ fieldProps }) => <TextField {...fieldProps} />}
      </Field>
      <Field
        label="Lastname"
        name="lastname"
        defaultValue="Of Rivia"
        placeholder="Of Rivia"
        isRequired
      >
        {({ fieldProps }) => <TextField {...fieldProps} />}
      </Field>
      <Field
        label="Email"
        name="email"
        defaultValue="gerald@cdprojektred.com"
        placeholder="gerald@cdprojektred.com"
        isRequired
      >
        {({ fieldProps }) => <TextField {...fieldProps} />}
      </Field>
      <Field
        label="Team"
        name="team"
        defaultValue="Gameplay"
        placeholder="Team"
        isRequired
      >
        {({ fieldProps }) => <Select options={options} {...fieldProps} />}
      </Field>
    </ModalDialog>
  );
}

EditResourceModal.propTypes = {
  setIsOpen: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  className: PropTypes.string.isRequired,
};
