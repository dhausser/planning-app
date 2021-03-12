import React, { ReactElement, Dispatch, SetStateAction } from 'react';
import { useMutation } from '@apollo/client';
import ModalDialog from '@atlaskit/modal-dialog';
import Form, { Field, OnSubmitHandler } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Select, { ValueType, OptionType } from '@atlaskit/select';
import Footer from './Footer';
import { ContainerProps, FormTypes, Team } from '../../types';
import {
  CREATE_RESOURCE,
  GET_RESOURCES,
  positions,
  validateOnSubmit,
} from '../../lib/useResources';
import useTeams from '../../lib/useTeams';

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function CreateResourceModal({ setIsOpen }: Props): ReactElement {
  const teamData = useTeams();
  const teams = teamData.map(({ id }: Team) => ({ label: id, value: id }));

  const [createResource] = useMutation(CREATE_RESOURCE, {
    refetchQueries: [{ query: GET_RESOURCES }],
  });

  const close = (): void => setIsOpen(false);

  const onFormSubmit: OnSubmitHandler<FormTypes> = (
    data
  ): Promise<Record<string, string> | undefined> => {
    createResource({
      variables: {
        ...data,
        position: data.position.value,
        team: data.team.value,
      },
    });
    setIsOpen(false);
    return Promise.resolve(validateOnSubmit(data));
  };

  return (
    <ModalDialog
      heading="Create"
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
      <p>Enter some text then submit the form to see the response.</p>
      <Field name="firstname" label="Firstname" defaultValue="" isRequired>
        {({ fieldProps }): React.ReactNode => <TextField {...fieldProps} />}
      </Field>
      <Field name="lastname" label="Lastname" defaultValue="" isRequired>
        {({ fieldProps }): React.ReactNode => <TextField {...fieldProps} />}
      </Field>
      <Field<ValueType<OptionType, false>>
        name="position"
        label="Select a position"
        // defaultValue={[]}
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
      <Field<ValueType<OptionType, false>>
        name="team"
        label="Select a team"
        // defaultValue={[]}
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
}

export default CreateResourceModal;
