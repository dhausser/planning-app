import { useQuery, gql } from '@apollo/client';
import { OptionType } from '@atlaskit/select';
import { Resource, InputValidation, ValidateOnSubmit } from '../types';

const RESOURCES_PER_PAGE = 8;

const positions = [
  { label: 'Producer', value: 'Producer' },
  { label: 'Programmer', value: 'Programmer' },
  { label: 'Designer', value: 'Designer' },
  { label: 'Tester', value: 'Tester' },
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
  query GetResources($offset: Int = 0, $limit: Int = ${RESOURCES_PER_PAGE}, $teamId: String) {
    teamId @client @export(as: "teamId")
    resources(offset: $offset, limit: $limit, teamId: $teamId) {
      key
      name
      team {
        name
      }
      position
      email
      avatarUrls {
        large
        small
      }
    }
  }
`;

const CREATE_RESOURCE = gql`
  mutation CreateResource(
    $firstname: String!
    $lastname: String!
    $position: String!
    $team: String!
  ) {
    createResource(
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
    deleteResource(id: $id) {
      key
    }
  }
`;

const CREATE_ALL_RESOURCES = gql`
  mutation CreateAllResources {
    createAllResources {
      key
    }
  }
`;

const DELETE_ALL_RESOURCES = gql`
  mutation DeleteAllResources {
    deleteAllResources
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
  CREATE_RESOURCE,
  UPDATE_RESOURCE,
  DELETE_RESOURCE,
  CREATE_ALL_RESOURCES,
  DELETE_ALL_RESOURCES,
  RESOURCES_PER_PAGE,
  positions,
  firstnameValidation,
  lastnameValidation,
  positonValidation,
  teamValidation,
  validateOnSubmit,
};
