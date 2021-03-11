/* eslint-disable no-restricted-globals */
import React from 'react';
import {
  useApolloClient,
  useMutation,
  gql,
  ApolloClient,
} from '@apollo/client';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import { useHistory, RouteComponentProps } from 'react-router-dom';

const SIGNIN = gql`
  mutation signin {
    signin {
      token
    }
  }
`;

function loginUser(client: ApolloClient<object>, history: any) {
  client.writeQuery({
    query: gql`
      {
        isLoggedIn
      }
    `,
    data: { isLoggedIn: true },
  });
  history.push('/');
  location.reload();
}

function useLogin() {
  const client = useApolloClient();
  const history = useHistory();
  const [login] = useMutation(SIGNIN, {
    onCompleted: ({ signin }) => {
      if (signin) {
        loginUser(client, history);
      }
    },
  });
  login();
}

const LoginForm: React.FC<RouteComponentProps> = () => {
  const client = useApolloClient();
  const history = useHistory();

  const actions = [
    {
      text: 'Login',
      onClick: (): void => {
        loginUser(client, history);
        location.href = 'http://localhost:4000/auth/provider';
      },
    },
  ];

  useLogin();

  return (
    <ModalTransition>
      <Modal actions={actions} heading="Login 👋">
        <p>Please log in with your Atlassian user profile.</p>
      </Modal>
    </ModalTransition>
  );
};

export default LoginForm;
