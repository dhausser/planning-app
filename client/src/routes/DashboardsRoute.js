import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productHomeView } from '../components/Nav'

import Dashboard from '../pages/Dashboard'

class DashboardsRouteBase extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props
    navigationViewController.setView(productHomeView.id)
  }

  render() {
    return (
      <div css={{ padding: 30 }}>
        <h1>Dashboards</h1>
        <h3>Projects:</h3>
        <ul>
          <li>
            <Link to="/projects/my-project">My Project</Link>
          </li>
        </ul>
        <Dashboard />
      </div>
    )
  }
}
export default withNavigationViewController(DashboardsRouteBase)

// const DashboardsRouteBase = ({ navigationViewController }) => {
//   useEffect(() => {
//     navigationViewController.setView(productHomeView.id)
//   })

//   return (
//     <div css={{ padding: 30 }}>
//       <h1>Dashboards</h1>
//       <h3>Projects:</h3>
//       <ul>
//         <li>
//           <Link to="/projects/my-project">My Project</Link>
//         </li>
//       </ul>
//     </div>
//   )
// }
// export default withNavigationViewController(DashboardsRouteBase)
