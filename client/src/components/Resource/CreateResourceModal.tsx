import React, { ReactElement } from 'react';
import { useMutation } from '@apollo/client';
import ModalDialog from '@atlaskit/modal-dialog';
import Form, { Field, OnSubmitHandler } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Select, { ValueType, OptionType } from '@atlaskit/select';
import Footer from './Footer';
import {
  ModalInterfaceProps,
  ContainerProps,
  FormTypes,
  InputValidation,
  ValidateOnSubmit,
} from '../../types';
import { INSERT_RESOURCE, GET_RESOURCES } from '../../lib/useResources';
// import useTeams from '../../lib/useTeams';

const positions = [
  { label: 'Producer', value: 'Producer' },
  { label: 'Programmer', value: 'Programmer' },
  { label: 'Designer', value: 'Designer' },
  { label: 'Tester', value: 'Tester' },
];

const teams = [
  { label: 'Art Center', value: 'Art Center' },
  { label: 'Comms Center', value: 'Comms Center' },
  { label: 'Diamonds', value: 'Diamonds' },
  { label: 'Gold', value: 'Gold' },
  { label: 'Forge', value: 'Forge' },
  { label: 'Tech Center', value: 'Tech Center' },
  { label: 'Tech Art Center', value: 'Tech Art Center' },
  { label: 'Titan', value: 'Titan' },
];

const firstnameValidation: InputValidation = (data, errors?) => {
  if (data.position && !(data.position instanceof Array)) {
    return (data.position as OptionType).value === 'dog'
      ? {
          ...errors,
          position: `${(data.position as OptionType).value} is not a position`,
        }
      : errors;
  }
  return errors;
};

const lastnameValidation: InputValidation = (data, errors?) => {
  if (data.position && !(data.position instanceof Array)) {
    return (data.position as OptionType).value === 'dog'
      ? {
          ...errors,
          position: `${(data.position as OptionType).value} is not a position`,
        }
      : errors;
  }
  return errors;
};

const positonValidation: InputValidation = (data, errors?) => {
  if (data.position && !(data.position instanceof Array)) {
    return (data.position as OptionType).value === 'dog'
      ? {
          ...errors,
          position: `${(data.position as OptionType).value} is not a position`,
        }
      : errors;
  }
  return errors;
};

const teamValidation: InputValidation = (data, errors?) => {
  if (data.team && data.team.length >= 3) {
    return {
      ...errors,
      team: `${data.team.length} is too many flavors, don't be greedy, you get to pick 2.`,
    };
  }

  return errors;
};

const validateOnSubmit: ValidateOnSubmit = (data) => {
  let errors;
  errors = firstnameValidation(data, errors);
  errors = lastnameValidation(data, errors);
  errors = positonValidation(data, errors);
  errors = teamValidation(data, errors);
  return errors;
};

function CreateResourceModal({ setIsOpen }: ModalInterfaceProps): ReactElement {
  // const teams = useTeams();
  // const options = teams.map(({ id }: Team) => ({ label: id, value: id }));

  const [insertResource] = useMutation(INSERT_RESOURCE, {
    onCompleted: (data) => {
      // eslint-disable-next-line no-console
      console.log(`Successfully created resource: ${data.displayName}`);
    },
  });

  const close = (): void => setIsOpen(false);

  const onFormSubmit: OnSubmitHandler<FormTypes> = (
    data
  ): Promise<Record<string, string> | undefined> => {
    insertResource({
      variables: {
        ...data,
        position: data.position.value,
        team: data.team.value,
      },
      refetchQueries: [{ query: GET_RESOURCES }],
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
      <Field<ValueType<OptionType>>
        name="position"
        label="Select a position"
        defaultValue={[]}
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
        defaultValue={[]}
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
export { INSERT_RESOURCE };
