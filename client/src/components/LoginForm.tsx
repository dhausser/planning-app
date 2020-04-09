import React, { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useApolloClient,
  // useMutation,
  // gql,
  // ApolloClient,
} from '@apollo/client';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

// const LOGIN_USER = gql`
//   mutation login {
//     login
//   }
// `;

// function useLoginMutation(client: ApolloClient<unknown>): ReactElement {
//   const client = useApolloClient();
//   const [login] = useMutation(LOGIN_USER, {
//     onCompleted: ({ login: token }) => {
//       localStorage.setItem('token', token);
//       client.writeQuery({
//         query: gql`
//           {
//             isLoggedIn
//           }
//         `,
//         data: { isLoggedIn: true },
//       });
//       window.opener.location.reload();
//       window.close();
//     },
//   });
//   login();
//   return <div />;
// }

const openRequestedPopup = (): Window | null => {
  const devEndpoint = process.env.REACT_APP_DEV_ENDPOINT;
  const prodEndpoint = process.env.REACT_APP_PROD_ENDPOINT;

  const url: string | undefined =
    process.env.NODE_ENV === 'production' ? prodEndpoint : devEndpoint;

  // eslint-disable-next-line no-restricted-globals
  const { width, height } = screen;

  const windowWidth = 1080;
  const windowHeight = 720;

  const left: number = width / 2 - windowWidth / 2;
  const top: number = height / 12;

  return window.open(
    url,
    '_blank',
    `width=${windowWidth}, height=${windowHeight}, top=${top}, left=${left}`
  );
};

function LoginForm(): ReactElement {
  // const location = useLocation();
  const actions = [{ text: 'Login', onClick: openRequestedPopup }];

  /**
   * TODO:
   * 1. Launch the login mutation on click
   * 2. Mutation resolver await for authentication token to be available with a timeout limit
   * 3. onCompleted closes the login popup window and triggers a update to logged in state
   */

  return (
    <ModalTransition>
      <Modal actions={actions} heading="Login 👋">
        <p>Please log in with your Atlassian user profile.</p>
      </Modal>
    </ModalTransition>
  );
}

export default LoginForm;
