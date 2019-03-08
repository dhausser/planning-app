import React from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import IssueList from '../components/IssueList';

const IssuePage = props => (
  <ContentWrapper>
    <PageTitle>Issues</PageTitle>
    <IssueList {...props} />
  </ContentWrapper>
);

export default IssuePage 