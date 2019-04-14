import express from 'express'
import issueController from '../controllers/issueController'
import absenceController from '../controllers/absenceController'

const router = express.Router()

function catchErrors(fn) {
  return function(req, res, next) {
    return fn(req, res, next).catch(next)
  }
}

// Routes to MongoDB
// router.get('/api/resources', catchErrors(resourceController.getResources))
// router.get('/api/teams', catchErrors(resourceController.getTeams))
// router.get('/api/holidays', catchErrors(holidayController.getHolidays))

// Routes to CD Projekt RED Portal
router.get('/api/absences', absenceController.getAbsences)

// Routes to Jira Server API
router.get('/api/issue', issueController.getIssue, issueController.getComments)
router.post('/api/issue', issueController.editIssue)
router.post('/api/search', issueController.searchIssues)
router.post('/api/fixVersions', issueController.getFixVersions)

export default router
