import React from 'react';
import { useApolloClient, useMutation, gql } from '@apollo/client';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import { RouteComponentProps } from 'react-router-dom';
// import { useHistory, RouteComponentProps } from 'react-router-dom';

const SIGNIN = gql`
  mutation signin {
    signin {
      token
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function useLogin(history: any) {
function useLogin() {
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
        // history.push('/projects');
      }
    },
  });
  login();
}

const LoginForm: React.FC<RouteComponentProps> = () => {
  // const history = useHistory();
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

  useLogin();
  // useLogin(history);

  return (
    <ModalTransition>
      <Modal actions={actions} heading="Login 👋">
        <p>Please log in with your Atlassian user profile.</p>
      </Modal>
    </ModalTransition>
  );
};

export default LoginForm;
