import express from 'express'
import issueController from '../controllers/issueController'
import absenceController from '../controllers/absenceController'

const router = express.Router()

// Routes to CD Projekt RED Portal
router.get('/api/absences', absenceController.getAbsences)

// Routes to Jira Server API
router.get('/api/issue', issueController.getIssue, issueController.getComments)
router.post('/api/issue', issueController.editIssue)
router.post('/api/search', issueController.searchIssues)
router.post('/api/fixVersions', issueController.getFixVersions)

export default router
