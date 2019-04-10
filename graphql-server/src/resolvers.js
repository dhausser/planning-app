const { paginateResults } = require('./utils');

module.exports = {
  Query: {
    issues: async (_, { jql, pageSize = 20, after }, { dataSources }) => {
      const allIssues = await dataSources.issueAPI.getAllIssues(
        jql,
        pageSize,
        after
      );

      const issues = paginateResults({
        after,
        pageSize,
        results: allIssues,
      });

      return {
        issues,
        cursor: issues.length ? issues[issues.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: issues.length
          ? issues[issues.length - 1].cursor !==
            allIssues[allIssues.length - 1].cursor
          : false,
      };
    },
    issue: (_, { id }, { dataSources }) =>
      dataSources.issueAPI.getIssueById({ issueId: id }),
    absences: (_, { id }, { dataSources }) =>
      dataSources.absenceAPI.getAbsencesById({ userId: id }),
    teams: async (_, __, { dataSources }) => dataSources.resourceAPI.getTeams(),
    resources: (_, __, { dataSources }) =>
      dataSources.resourceAPI.getResources(),
  },
  Mutation: {
    editIssue: async (_, { issueId, summary }, { dataSources }) => {
      const result = await dataSources.issueAPI.editIssue({ issueId, summary });
      console.log({ result });

      return {
        success: 'success status',
        message: 'success message',
        issue: 'returned issue',
      };
    },
  },
};
