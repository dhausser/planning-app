import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { productIssuesView } from '../components/Nav'
import Issues from '../pages/Issues'

class IssuesAndFiltersRouteBase extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props
    navigationViewController.setView(productIssuesView.id)
  }

  render() {
    return <Issues />
  }
}
export default withNavigationViewController(IssuesAndFiltersRouteBase)

// const IssuesAndFiltersRouteBase = ({ navigationViewController }) => {
//   useEffect(() => {
//     navigationViewController.setView(productIssuesView.id)
//   })

//   return (
//     <div css={{ padding: 30 }}>
//       <h1>Issues and filters</h1>
//     </div>
//   )
// }
// export default withNavigationViewController(IssuesAndFiltersRouteBase)
