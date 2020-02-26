const path = require("path")

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  // Only update the `/app` page.
  if (page.path.match(/^\/app/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = "/app/*"

    // Update the page.
    createPage(page)
  }

  if (page.path.match(/^\/resource/)) {
    createPage({
      path: "/resource/",
      matchPath: "/resource/:resourceId",
      component: path.resolve(`./src/pages/resource.js`),
    })
  }

  if (page.path.match(/^\/issue/)) {
    createPage({
      path: "/issue/",
      matchPath: "/issue/:issueId",
      component: path.resolve(`./src/pages/issue.js`),
    })
  }
}
