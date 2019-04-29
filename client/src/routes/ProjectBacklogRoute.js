import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { projectHomeView } from '../components/Nav'
import Roadmap from '../pages/Roadmap'

class ProjectBacklogRouteBase extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props
    navigationViewController.setView(projectHomeView.id)
  }

  render() {
    return (
      <div css={{ padding: 30 }}>
        <h1>My Project</h1>
        <p>
          <Link to="/">Back to Dashboards</Link>
        </p>
        <Roadmap />
      </div>
    )
  }
}
export default withNavigationViewController(ProjectBacklogRouteBase)

/**
 * Hook
 */
// const ProjectBacklogRouteBase = ({ navigationViewController }) => {
//   useEffect(() => {
//     navigationViewController.setView(projectHomeView.id)
//   })

//   return (
//     <div css={{ padding: 30 }}>
//       <h1>My Project</h1>
//       <p>
//         <Link to="/">Back to Dashboards</Link>
//       </p>
//     </div>
//   )
// }
// export default withNavigationViewController(ProjectBacklogRouteBase)
