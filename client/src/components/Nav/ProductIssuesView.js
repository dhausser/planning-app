import { JiraWordmark } from "@atlaskit/logo"
import LinkItem from "./LinkItem"

export default {
  id: "product/issues",
  type: "product",
  getItems: () => [
    {
      type: "HeaderSection",
      id: "product/issues:header",
      items: [
        {
          type: "Wordmark",
          wordmark: JiraWordmark,
          id: "jira-wordmark",
        },
        {
          type: "BackItem",
          id: "back-item",
          goTo: "project/home",
        },
      ],
    },
    {
      type: "MenuSection",
      nestedGroupKey: "menu",
      id: "product/issues:menu",
      parentId: "product/home:menu",
      alwaysShowScrollHint: true,
      items: [
        {
          type: "SectionHeading",
          text: "Issues and filters",
          id: "issues-and-filters-heading",
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          id: "search-issues",
          text: "Search issues",
          to: "/issues",
        },
        { type: "GroupHeading", id: "other-heading", text: "Other" },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "My open issues",
          id: "my-open-issues",
          to: "/issues/?filter=-1",
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "Reported by me",
          id: "reported-by-me",
          to: "/issues/?filter=-2",
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "All issues",
          id: "all-issues",
          to: "/issues/?filter=-4",
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "Open issues",
          id: "open-issues",
          to: "/issues/?filter=-5",
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "Done issues",
          id: "done-issues",
          to: "/issues/?filter=-9",
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "Viewed recently",
          id: "viewed-recently",
          to: "/issues/?filter=-3",
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "Created recently",
          id: "created-recently",
          to: "/issues/?filter=-6",
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "Resolved recently",
          id: "resolved-recently",
          to: "/issues/?filter=-7",
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "Updated recently",
          id: "updated-recently",
          to: "/issues/?filter=-8",
        },
        { type: "Separator", id: "separator" },
        {
          type: "InlineComponent",
          component: LinkItem,
          text: "View all filters",
          id: "view-all-filters",
          to: "/issues/10",
        },
      ],
    },
  ],
}
