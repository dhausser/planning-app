const express = require('express');

const router = express.Router();

const holidayController = require('../controllers/holidayController');
const issueController = require('../controllers/issueController');
const resourceController = require('../controllers/resourceController');

const catchErrors = fn => function (req, res, next) {
  return fn(req, res, next).catch(next);
};

router.get('/api/resources', catchErrors(resourceController.getResources));
router.get('/api/holidays', catchErrors(holidayController.getHolidays));
router.get('/api/teams', catchErrors(resourceController.getTeams));
router.get('/api/issues', catchErrors(issueController.getIssues));
router.get('/api/test', catchErrors(issueController.getQuery));
router.get('/api/search', catchErrors(
  issueController.httpsRequest,
  issueController.shallowCopy,
  issueController.getIssues
));

module.exports = router;
