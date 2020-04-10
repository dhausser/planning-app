import React, { ReactElement } from 'react';
import { useMutation } from '@apollo/client';
import Form, { Field, OnSubmitHandler } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Select, { ValueType, OptionType } from '@atlaskit/select';
import ModalDialog from '@atlaskit/modal-dialog';
import Footer from './Footer';
import { ModalInterfaceProps, ContainerProps, FormTypes } from '../../types';
import {
  UPDATE_RESOURCE,
  GET_RESOURCES,
  positions,
  teams,
  validateOnSubmit,
} from '../../lib/useResources';
// import useTeams from '../../lib/useTeams';

const EditResourceModal = ({
  selection,
  setIsOpen,
}: ModalInterfaceProps): ReactElement => {
  // const teams = useTeams();
  // const options = teams.map(({ id }: Team) => ({ label: id, value: id }));
  const { key, displayName, position, team } = selection;
  const firstname = displayName.split(' ')[0];
  const lastname = displayName.split(' ')[1];
  const positionOption = { label: position, value: position };
  const teamOption = { label: team, value: team };

  const [updateResource] = useMutation(UPDATE_RESOURCE, {
    refetchQueries: [{ query: GET_RESOURCES }],
  });

  const close = (): void => setIsOpen(false);

  const onFormSubmit: OnSubmitHandler<FormTypes> = (
    data
  ): Promise<Record<string, string> | undefined> => {
    updateResource({
      variables: {
        ...data,
        id: key,
        position: data.position.value,
        team: data.team.value,
      },
    });
    setIsOpen(false);
    return Promise.resolve(validateOnSubmit(data));
  };

  return (
    <ModalDialog
      heading="Edit"
      scrollBehavior="outside"
      onClose={close}
      components={{
        // eslint-disable-next-line react/display-name
        Container: ({ children, className }: ContainerProps): ReactElement => (
          <div
            style={{
              display: 'flex',
              width: '400px',
              margin: '0 auto',
              flexDirection: 'column',
            }}
          >
            <Form<FormTypes> onSubmit={onFormSubmit}>
              {({ formProps }): ReactElement => (
                <form {...formProps} className={className}>
                  {children}
                </form>
              )}
            </Form>
          </div>
        ),
      }}
    >
      <Field
        name="firstname"
        label="Firstname"
        defaultValue={firstname}
        isRequired
      >
        {({ fieldProps }): React.ReactNode => <TextField {...fieldProps} />}
      </Field>
      <Field
        name="lastname"
        label="Lastname"
        defaultValue={lastname}
        isRequired
      >
        {({ fieldProps }): React.ReactNode => <TextField {...fieldProps} />}
      </Field>
      <Field<ValueType<OptionType>>
        name="position"
        label="Select a position"
        defaultValue={positionOption}
        isRequired
      >
        {({ fieldProps: { id, ...rest }, error }): React.ReactNode => (
          <Select
            validationState={error ? 'error' : 'default'}
            inputId={id}
            {...rest}
            options={positions}
            isSearchable
            isClearable
          />
        )}
      </Field>
      <Field<ValueType<OptionType>>
        name="team"
        label="Select a team"
        defaultValue={teamOption}
        isRequired
      >
        {({ fieldProps: { id, ...rest }, error }): React.ReactNode => (
          <Select
            validationState={error ? 'error' : 'default'}
            inputId={id}
            {...rest}
            options={teams}
            isSearchable
            isClearable
          />
        )}
      </Field>
      <Footer setIsOpen={setIsOpen} />
    </ModalDialog>
  );
};

export default EditResourceModal;
