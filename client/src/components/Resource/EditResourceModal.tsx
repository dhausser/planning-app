import React, { ReactElement } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Form, { Field } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import ModalDialog from '@atlaskit/modal-dialog';
import Footer from './Footer';
import { GET_TEAMS } from '../Filters/TeamFilter';
import { ModalInterfaceProps, Team, FormTypes } from '../../types';
import { UPDATE_RESOURCE, GET_RESOURCES } from '../../lib/useResources';

const EditResourceModal = ({
  selection,
  setIsOpen,
}: ModalInterfaceProps): ReactElement => {
  const inputs = {};
  const [updateResource] = useMutation(UPDATE_RESOURCE, {
    variables: { ...inputs },
    refetchQueries: [{ query: GET_RESOURCES }],
  });
  const { data } = useQuery(GET_TEAMS);
  const options =
    data &&
    data.teams &&
    data.teams.map(({ id }: Team) => ({ label: id, value: id }));

  return (
    <ModalDialog
      heading="Edit"
      scrollBehavior="outside"
      onClose={(): void => setIsOpen(false)}
      components={{
        // eslint-disable-next-line react/display-name
        Container: ({ children, className }): ReactElement => (
          <Form<FormTypes>
            onSubmit={({ firstname, lastname, position, team }): void => {
              const id = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
              updateResource({
                variables: {
                  id,
                  firstname,
                  lastname,
                  position,
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
      <Field
        label="Firstname"
        name="firstname"
        defaultValue="Gerald"
        isRequired
      >
        {({ fieldProps }): React.ReactNode => <TextField {...fieldProps} />}
      </Field>
      <Field
        label="Lastname"
        name="lastname"
        defaultValue="Of Rivia"
        isRequired
      >
        {({ fieldProps }): React.ReactNode => <TextField {...fieldProps} />}
      </Field>
      <Field
        label="Email"
        name="email"
        defaultValue="gerald@cdprojektred.com"
        isRequired
      >
        {({ fieldProps }): React.ReactNode => <TextField {...fieldProps} />}
      </Field>
      <Field label="Team" name="team" defaultValue="Gameplay" isRequired>
        {(): React.ReactNode => <Select options={options} />}
      </Field>
    </ModalDialog>
  );
};

export default EditResourceModal;
