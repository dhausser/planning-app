import { gql, useApolloClient, useMutation } from '@apollo/client';

const LOGIN_USER = gql`
  mutation login {
    login
  }
`;

export default () => {
  const client = useApolloClient();
  const [login] = useMutation(
    LOGIN_USER,
    {
      onCompleted: ({ login: token }) => {
        localStorage.setItem('token', token);
        client.writeData({ data: { isLoggedIn: true } });
        window.opener.location.reload();
        window.close();
      },
    },
  );
  login();
  return null;
}
