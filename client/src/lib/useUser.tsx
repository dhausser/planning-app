import { gql, useQuery } from '@apollo/client';

interface User {
  avatarUrls: { small: string };
}

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    myself {
      avatarUrls {
        small
      }
    }
  }
`;

export function useUserLogin(): boolean {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn;
}

function useUser(): User | null {
  const { data } = useQuery(GET_CURRENT_USER);
  if (data && data.myself) {
    return data.myself;
  }
  return null;
}

export function useUserAvatar(): string | null {
  const user = useUser();
  if (user) {
    return user.avatarUrls && user.avatarUrls.small;
  }
  return null;
}

export default useUser;
