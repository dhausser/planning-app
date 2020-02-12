import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { Location } from "@reach/router"

function LinkItem({ components: { Item }, to, ...props }) {
  return (
    <Location>
      {({ location }) => (
        <Item
          component={({ children, className }) => (
            <Link css={{ color: "#DEEBFF" }} className={className} to={to}>
              {children}
            </Link>
          )}
          isSelected={location.pathname === to}
          {...props}
        />
      )}
    </Location>
  )
}

// function LinkItem({ components: { Item }, to, ...props }) {
//   return (
//     <Route
//       render={({ location: { pathname } }) => (
//         <Item
//           component={({ children, className }) => (
//             <Link css={{ color: "#DEEBFF" }} className={className} to={to}>
//               {children}
//             </Link>
//           )}
//           isSelected={pathname === to}
//           {...props}
//         />
//       )}
//     />
//   )
// }

LinkItem.propTypes = {
  components: PropTypes.objectOf(PropTypes.func).isRequired,
  to: PropTypes.string.isRequired,
}

export default LinkItem
