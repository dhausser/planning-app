import React from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import IssueList from '../components/IssueList';

export default function Issues(props) {
  return (
    <ContentWrapper>
      <PageTitle>Issues</PageTitle>
      <IssueList {...props} />
    </ContentWrapper>
  )
};