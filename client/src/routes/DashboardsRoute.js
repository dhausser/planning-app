import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  withNavigationViewController,
  UIControllerSubscriber,
} from '@atlaskit/navigation-next'
import Button from '@atlaskit/button'
import ChevronLeft from '@atlaskit/icon/glyph/chevron-left'
import ChevronRight from '@atlaskit/icon/glyph/chevron-right'
import { productHomeView } from '../components/Nav'
import Dashboard from '../pages/Dashboard'

const ExpandToggleButton = () => (
  <UIControllerSubscriber>
    {navigationUIController => (
      <Button
        iconBefore={
          navigationUIController.state.isCollapsed ? (
            <ChevronRight />
          ) : (
            <ChevronLeft />
          )
        }
        onClick={navigationUIController.toggleCollapse}
      >
        {navigationUIController.state.isCollapsed ? 'Expand' : 'Collapse'}{' '}
        navigation
      </Button>
    )}
  </UIControllerSubscriber>
)

class DashboardsRouteBase extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props
    navigationViewController.setView(productHomeView.id)
  }

  render() {
    return (
      <div css={{ padding: 30 }}>
        <ExpandToggleButton />
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
