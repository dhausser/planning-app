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

function useLogin(history: any): void {
  const client = useApolloClient();
  const [login] = useMutation(SIGNIN, {
    onCompleted: ({ signin }) => {
      if (signin) {
        // const { token } = signin;
        // console.log(signin);
        // localStorage.setItem('token', token);
        client.writeQuery({
          query: gql`
            {
              isLoggedIn
            }
          `,
          data: { isLoggedIn: true },
        });
        history.push('/projects');
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
      // eslint-disable-next-line no-restricted-globals
      onClick: (): null => {
        // eslint-disable-next-line no-restricted-globals
        location.href = 'http://localhost:4000/auth/provider';
        return null;
      },
    },
  ];

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
