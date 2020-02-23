import React, { useEffect } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import {
  withNavigationViewController,
  LayoutManagerWithViewController,
} from "@atlaskit/navigation-next"
import {
  GlobalNavigation,
  productHomeView,
  productIssuesView,
  projectHomeView,
} from "../components"
import Page from "@atlaskit/page"
import "@atlaskit/css-reset"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 40px;
  box-sizing: border-box;
  height: 100vh;
`

const Layout = ({ children, navigationViewController }) => {
  useEffect(() => {
    navigationViewController.addView(productHomeView)
    navigationViewController.addView(productIssuesView)
    navigationViewController.addView(projectHomeView)
  }, [navigationViewController])
  return (
    <LayoutManagerWithViewController globalNavigation={GlobalNavigation}>
      <Page>
        <Wrapper>{children}</Wrapper>
      </Page>
    </LayoutManagerWithViewController>
  )
}

Layout.defaultProps = {
  children: null,
}

Layout.propTypes = {
  children: PropTypes.node,
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
}

export default withNavigationViewController(Layout)
