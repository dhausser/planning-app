import {
  searchIssues,
  getIssue,
  getComments,
  editIssue,
  getFixVersions,
} from '../controllers/issueController';
import { getHolidays } from '../controllers/holidayController';
import { getResources, getTeams } from '../controllers/resourceController';

function catchErrors(fn) {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
}

export default function routes(app, addon) {
  // app.get('/', (req, res) => {
  //   res.redirect('/atlassian-connect.json');
  // });

  // Routes to MongoDB
  app.get('/api/resources', catchErrors(getResources));
  app.get('/api/holidays', catchErrors(getHolidays));
  app.get('/api/teams', catchErrors(getTeams));

  // Routes to Jira Server API
  app.get('/api/issue', getIssue, getComments);
  app.post('/api/issue', editIssue);
  app.post('/api/search', searchIssues);
  app.get('/api/fixVersions', getFixVersions);
}
