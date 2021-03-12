import React, { ReactElement } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Form, { Field, OnSubmitHandler } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Select, { ValueType, OptionType } from '@atlaskit/select';
import ModalDialog from '@atlaskit/modal-dialog';
import Footer from './Footer';
import {
  ModalInterfaceProps,
  ContainerProps,
  FormTypes,
  Team,
} from '../../types';
import {
  UPDATE_RESOURCE,
  GET_RESOURCES,
  positions,
  validateOnSubmit,
} from '../../lib/useResources';
import useTeams from '../../lib/useTeams';

const GET_TEAM_FILTER = gql`
  query GetTeamFilter {
    teamId @client
  }
`;

const EditResourceModal = ({
  selection,
  setIsOpen,
}: ModalInterfaceProps): ReactElement => {
  const { data: teamId } = useQuery(GET_TEAM_FILTER);
  const teamsData = useTeams();
  const teams = teamsData.map(({ id }: Team) => ({ label: id, value: id }));
  const { key, name, position, team } = selection;
  const [firstname, lastname] = name.split(' ');
  const positionOption = { label: position, value: position };
  const teamOption = { label: team, value: team };

  /**
   * TODO: Cache invalidation after update
   */
  const [updateResource] = useMutation(UPDATE_RESOURCE, {
    refetchQueries: [{ query: GET_RESOURCES, variables: { teamId } }],
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
      <Field<ValueType<OptionType, false>>
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
      <Field<ValueType<OptionType, false>>
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
