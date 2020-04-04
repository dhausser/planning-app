import { useQuery, gql, ApolloError } from '@apollo/client';
import { Project } from '../types';

interface ProjectQueryResult {
  data: ProjectData | undefined;
  error: ApolloError | undefined;
  loading: boolean;
}

interface ProjectData {
  projects: Project[];
}

const PROJECT_TILE_DATA = gql`
  fragment ProjectTile on Project {
    id
    key
    name
    projectTypeKey
  }
`;

const GET_PROJECTS = gql`
  query GetSwitcherProjects {
    projectId @client
    projects {
      ...ProjectTile
      avatarUrls {
        large
        small
      }
    }
  }
  ${PROJECT_TILE_DATA}
`;

const useProjects = (): ProjectQueryResult => {
  const { loading, error, data } = useQuery<ProjectData>(GET_PROJECTS);
  return { loading, error, data };
};

export default useProjects;
