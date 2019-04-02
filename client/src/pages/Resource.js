import React, { useState, useEffect } from 'react';

import Avatar from '@atlaskit/avatar';
import Calendar from '@atlaskit/calendar';
import EmptyState from '@atlaskit/empty-state';
import Spinner from '@atlaskit/spinner';

import IssueList from '../components/IssueList';
import Filters from '../components/Filters';
import PageTitle from '../components/PageTitle';
import ContentWrapper, {
  NameWrapper,
  AvatarWrapper,
  Center,
} from '../components/ContentWrapper';
import { fetchIssues } from '../modules/Helpers';
import HolidayList from '../components/HolidayList';

export default function Resource(props) {
  const [data, setData] = useState({
    issues: [],
    isLoading: true,
  });
  const [absences, setAbsences] = useState([]);
  const { resourceId } = props.params;

  useEffect(() => {
    let ignore = false;

    async function fetchAbsences() {
      const res = await fetch(`/api/absences?user=${resourceId}`);
      const result = await res.json();
      if (!ignore) setAbsences(result);
    }

    fetchIssues(
      {
        jql: `assignee=${resourceId}`,
        fields: [
          'summary',
          'description',
          'status',
          'assignee',
          'creator',
          'issuetype',
          'priority',
          'fixVersions',
        ],
      },
      setData,
      ignore
    );
    fetchAbsences();
    return () => {
      ignore = true;
    };
  }, [resourceId]);

  if (data.isLoading)
    return (
      <Center>
        <Spinner size="large" />
      </Center>
    );

  if (data.issues === [])
    return (
      <EmptyState
        header="This person doesn't exist"
        description={`The person you are trying to lookup isn't currently recorded in the database.`}
      />
    );

  return (
    <ContentWrapper>
      <PageTitle>
        <NameWrapper>
          <AvatarWrapper>
            <Avatar
              name={data.issues[0].fields.assignee.displayName}
              size="large"
              src={`https://jira.cdprojektred.com/secure/useravatar?ownerId=${resourceId}`}
            />
          </AvatarWrapper>
          {data.issues[0].fields.assignee.displayName}
        </NameWrapper>
      </PageTitle>
      <Filters />
      <a
        href={`https://jira.cdprojektred.com/issues/?jql=assignee=${resourceId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in Issue Navigator
      </a>
      <IssueList
        issues={data.issues}
        maxResults={data.maxResults}
        total={data.total}
        isLoading={data.isLoading}
      />
      <HolidayList absences={absences} isLoading={data.isLoading} />
      <Calendar day={0} defaultDisabled={absences} />
    </ContentWrapper>
  );
}
