import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    versionFilter: Version
    teamFilter: String
  }
  extend type Version {
    id: ID
    name: String
  }
`

export const resolvers = {
  // Launch: {
  //   isInCart: (launch, _, { cache }) => {
  //     const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS })
  //     return cartItems.includes(launch.id)
  //   },
  // },
  // Mutation: {
  //   addOrRemoveFromCart: (_, { id }, { cache }) => {
  //     const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS })
  //     const data = {
  //       cartItems: cartItems.includes(id)
  //         ? cartItems.filter(i => i !== id)
  //         : [...cartItems, id],
  //     }
  //     cache.writeQuery({ query: GET_CART_ITEMS, data })
  //     return data.cartItems
  //   },
  // },
}
