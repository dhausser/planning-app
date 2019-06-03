import React, { useState, useEffect } from 'react'
import Modal, { ModalTransition } from '@atlaskit/modal-dialog'
import { Redirect, withRouter } from 'react-router-dom'

export default withRouter(({ history }) => {
  const [requestToken, setRequestToken] = useState(
    localStorage.getItem('requestToken'),
  )
  const [accessToken, setAccessToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    async function getRequestToken() {
      try {
        const response = await fetch('/auth/connect')
        const { token } = await response.json()
        if (token) {
          setRequestToken(token)
          localStorage.setItem('requestToken', token)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (!requestToken) {
      getRequestToken()
    } else if (window.location.search) {
      const url = new URL(window.location)
      const searchParams = new URLSearchParams(url.search)
      window.history.pushState({}, document.title, '/')
      try {
        const token = searchParams.get('oauth_access_token')
        if (token) {
          localStorage.setItem('token', token)
          setAccessToken(token)
          history.push('/projects')
          // localStorage.remove('requestToken')
          // console.log({ token })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }, [requestToken, accessToken, history])

  const actions = [
    {
      text: 'Login with Jira',
      onClick: () =>
        window.location.replace(
          `https://jira.cdprojektred.com/plugins/servlet/oauth/authorize?oauth_token=${requestToken}`,
        ),
    },
  ]

  return (
    <>
      {accessToken ? (
        // Redirect to dashboard page
        <p>{accessToken}</p>
      ) : (
        // <Redirect to={{ pathname: '/projects' }} />
        <ModalTransition>
          <Modal actions={actions} heading="Hi there 👋">
            <p>
              In order to proceed please authorise this app to access your Jira
              data
            </p>
          </Modal>
        </ModalTransition>
      )}
    </>
  )
})

// import gql from 'graphql-tag'
// import {useQuery, useMutation } from 'react-apollo-hooks'
// import {ApolloConsumer, Mutation } from 'react-apollo'
// import Spinner from '@atlaskit/spinner'
// import EmptyState from '@atlaskit/empty-state'
// import Spinner from '@atlaskit/spinner'

// const LOGIN_USER = gql`
//   mutation login(
//     $oauthToken: String!
//     $oauthSecret: String!
//     $oauthVerifier: String!
//   ) {
//     login(
//       oauthToken: $oauthToken
//       oauthSecret: $oauthSecret
//       oauthVerifier: $oauthVerifier
//     )
//   }
// `

// const REQUEST_TOKEN = gql`
//   query oauthRequest {
//     oauthRequest {
//       token
//       secret
//     }
//   }
// `

// const ACCESS_TOKEN = gql`
//   query oauthAccess($oauthVerifier: String!) {
//     oauthAccess(oauthVerifier: $oauthVerifier) {
//       token
//       secret
//     }
//   }
// `

// useEffect(() => {
//   fetch('/auth/connect')
//     .then(function(response) {
//       return response.json()
//     })
//     .then(function(data) {
//       const { url } = data
//       console.log(JSON.stringify(url))
//       setLink(url)
//     })
// }, [link])

// export default () => {
//   const [temp, setTemp] = useState(false)
//   const { data, loading, error } = useQuery(REQUEST_TOKEN)

//   // const authToken = await fetch('http://localhost:4000/auth/connect')
//   // console.log({ authToken })

//   if (loading) return <Spinner size="large" />
//   if (error) return <EmptyState header="Error" description={error.message} />

//   const { token, secret } = data.oauthRequest

//   console.log({ data })

//   return (
//     <ApolloConsumer>
//       {client => (
//         <Mutation
//           mutation={LOGIN_USER}
//           onCompleted={({ login }) => {
//             if (login) {
//               console.log({ login })
//               // localStorage.setItem('token', login)
//               // client.writeData({ data: { isLoggedIn: true } })
//             }
//           }}
//         >
//           {(login, { error }) => {
//             if (error)
//               return <EmptyState header="Error" description={error.message} />

//             const actions = [
//               {
//                 text: 'Login with Jira',
//                 onClick: () => authenticate(client, token),
//               },
//             ]

//             /**
//              * TODO: Ensure this code run only once per flow
//              */
//             const { search } = window.location
//             if (search) {
//               console.log('Reading search params...')
//               const url = new URL(window.location)
//               const searchParams = new URLSearchParams(url.search)
//               window.history.pushState({}, document.title, '/')
//               try {
//                 const oauthToken = searchParams.get('oauth_token')
//                 const oauthSecret = secret
//                 const oauthVerifier = searchParams.get('oauth_verifier')
//                 console.log({ oauthToken, oauthSecret, oauthVerifier })
//                 setTemp(true)
//                 login({
//                   variables: { oauthToken, oauthSecret, oauthVerifier },
//                 })
//               } catch (err) {
//                 return <EmptyState header="Error" description={err.message} />
//               }
//             }

//             return (
//               <>
//                 {token && !temp ? (
//                   <ModalTransition>
//                     <Modal actions={actions} heading="Hi there 👋">
//                       <p>
//                         In order to proceed please authorise this app to access
//                         your Jira data
//                       </p>
//                     </Modal>
//                   </ModalTransition>
//                 ) : (
//                   <p>Trying to login...</p>
//                 )}
//               </>
//             )
//           }}
//         </Mutation>
//       )}
//     </ApolloConsumer>
//   )
// }

// function authenticate(client, requestToken) {
//   window.location.replace(
//     `https://jira.cdprojektred.com/plugins/servlet/oauth/authorize?oauth_token=${requestToken}`,
//   )
//   client.writeData({ data: { isLoggedIn: true } })
// }
