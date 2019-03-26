const express = require('express');

const router = express.Router();

const holidayController = require('./controllers/holidayController');
const issueController = require('./controllers/issueController');
const resourceController = require('./controllers/resourceController');

const catchErrors = fn =>
  function(req, res, next) {
    return fn(req, res, next).catch(next);
  };

// Routes to MongoDB
router.get('/api/resources', catchErrors(resourceController.getResources));
router.get('/api/holidays', catchErrors(holidayController.getHolidays));
router.get('/api/issues', catchErrors(issueController.getIssues));
router.get('/api/teams', catchErrors(resourceController.getTeams));

// Routes to Jira Server API
router.get('/api/issue', issueController.getIssue, issueController.getComments);
router.post('/api/issue', issueController.editIssue);
router.post('/api/search', issueController.searchIssues);

module.exports = router;
