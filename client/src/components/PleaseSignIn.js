import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'
import Signin from './Signin'
import Loading from './Loading'

export default props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <Loading />
      if (!data.me) {
        return (
          <>
            <p>Please Sign In before continuing</p>
            <Signin />
          </>
        )
      }
    }}
  </Query>
)
