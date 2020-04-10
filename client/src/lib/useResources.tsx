import { useQuery, gql } from '@apollo/client';
import { OptionType } from '@atlaskit/select';
import { Resource, InputValidation, ValidateOnSubmit } from '../types';

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

const GET_RESOURCES = gql`
  query GetResources($teamId: String) {
    teamId @client @export(as: "teamId")
    resources(teamId: $teamId) {
      key
      displayName
      team
      position
      email
      avatarUrls {
        large
        small
      }
    }
  }
`;

const INSERT_RESOURCE = gql`
  mutation InsertResource(
    $firstname: String!
    $lastname: String!
    $position: String!
    $team: String!
  ) {
    insertResource(
      firstname: $firstname
      lastname: $lastname
      position: $position
      team: $team
    ) {
      key
    }
  }
`;

const UPDATE_RESOURCE = gql`
  mutation UpdateResource(
    $id: ID!
    $firstname: String!
    $lastname: String!
    $position: String!
    $team: String!
  ) {
    updateResource(
      id: $id
      firstname: $firstname
      lastname: $lastname
      position: $position
      team: $team
    ) {
      key
    }
  }
`;

const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id)
  }
`;

function useResources(): Resource[] {
  const { loading, error, data } = useQuery(GET_RESOURCES);
  if (loading || error) return [];
  return Array.isArray(data.resources) ? data.resources : [];
}

export default useResources;
export {
  GET_RESOURCES,
  INSERT_RESOURCE,
  UPDATE_RESOURCE,
  DELETE_RESOURCE,
  positions,
  teams,
  firstnameValidation,
  lastnameValidation,
  positonValidation,
  teamValidation,
  validateOnSubmit,
};
