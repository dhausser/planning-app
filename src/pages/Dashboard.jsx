import React from 'react';
import MainSection from '../components/atlaskit/MainSection';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';

export default function Dashboard() {
  return (
    <ContentWrapper>
      <PageTitle>Dashboard</PageTitle>
      <MainSection />
    </ContentWrapper>
  );
}
