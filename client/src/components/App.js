import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import {
  LayoutManagerWithViewController,
  NavigationProvider,
  withNavigationViewController,
} from '@atlaskit/navigation-next'

import {
  MyGlobalNavigation,
  productHomeView,
  productIssuesView,
  projectHomeView,
} from './Nav'

// Routes
import DashboardsRoute from '../routes/DashboardsRoute'
import ProjectBacklogRoute from '../routes/ProjectBacklogRoute'
import IssuesAndFiltersRoute from '../routes/IssuesAndFiltersRoute'

// Pages
// import Dashboard from '../pages/Dashboard'
import Roadmap from '../pages/Roadmap'
import Resources from '../pages/Resources'
import Resource from '../pages/Resource'
import Issues from '../pages/Issues'
import Issue from '../pages/Issue'
import Absences from '../pages/Absences'

class App extends Component {
  componentDidMount() {
    const { navigationViewController } = this.props
    navigationViewController.addView(productHomeView)
    navigationViewController.addView(productIssuesView)
    navigationViewController.addView(projectHomeView)
  }

  render() {
    return (
      <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
        <Switch>
          {/* <Route exact path="/" component={Dashboard} /> */}
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/resources" component={Resources} />
          <Route path="/resource/:resourceId" component={Resource} />
          <Route path="/issues" component={Issues} />
          <Route path="/issue/:issueId" component={Issue} />
          <Route path="/absences" component={Absences} />
          <Route path="/projects/my-project" component={ProjectBacklogRoute} />
          <Route path="/issues" component={IssuesAndFiltersRoute} />
          <Route path="/" component={DashboardsRoute} />
        </Switch>
      </LayoutManagerWithViewController>
    )
  }
}
const AppWithNavigationViewController = withNavigationViewController(App)

export default () => (
  <HashRouter>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
  </HashRouter>
)

/**
 * Hook App
 */
// const App = ({ navigationViewController }) => {
//   const filterContext = useContext(FilterContext)
//   const [fixVersion, setFixVersion] = useState(filterContext.fixVersion)
//   const [teamFilter, setTeamFilter] = useState(filterContext.teamFilter)

//   useEffect(() => {
//     navigationViewController.addView(productHomeView)
//     navigationViewController.addView(productIssuesView)
//     navigationViewController.addView(projectHomeView)
//   })

//   return (
//     <FilterContext.Provider
//       value={{
//         teamFilter,
//         setTeamFilter,
//         fixVersion,
//         setFixVersion,
//       }}
//     >
//       <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
//         <Switch>
//           <Route path="/projects/my-project" component={ProjectBacklogRoute} />
//           <Route path="/issues" component={IssuesAndFiltersRoute} />
//           <Route path="/" component={DashboardsRoute} />
//         </Switch>
//       </LayoutManagerWithViewController>
//     </FilterContext.Provider>
//   )
// }
// const AppWithNavigationViewController = withNavigationViewController(App)
