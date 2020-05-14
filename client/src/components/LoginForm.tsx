/* eslint-disable no-restricted-globals */
import React from 'react';
import { useApolloClient, useMutation, gql } from '@apollo/client';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import { useHistory, RouteComponentProps } from 'react-router-dom';

const SIGNIN = gql`
  mutation signin {
    signin {
      token
    }
  }
`;

function useLogin(history: any) {
  const client = useApolloClient();
  const [login] = useMutation(SIGNIN, {
    onCompleted: ({ signin }) => {
      if (signin) {
        client.writeQuery({
          query: gql`
            {
              isLoggedIn
            }
          `,
          data: { isLoggedIn: true },
        });
        // setIsLoggedIn(true);
        history.push('/');
        location.reload();
      }
    },
  });
  login();
}

const LoginForm: React.FC<RouteComponentProps> = () => {
  const history = useHistory();
  const actions = [
    {
      text: 'Login',
      onClick: (): null => {
        location.href = 'http://localhost:4000/auth/provider';
        return null;
      },
    },
  ];

  // useLogin();
  useLogin(history);

  return (
    <ModalTransition>
      <Modal actions={actions} heading="Login 👋">
        <p>Please log in with your Atlassian user profile.</p>
      </Modal>
    </ModalTransition>
  );
};

export default LoginForm;
