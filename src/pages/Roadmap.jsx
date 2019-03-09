import React from 'react';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';
import IssueList from '../components/IssueList';

export default function Roadmap(props) {
  return (
    <ContentWrapper>
      <PageTitle>Roadmap</PageTitle>
      <IssueList {...props} />
    </ContentWrapper>
  )
};