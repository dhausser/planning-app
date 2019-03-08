import React from 'react';
import HolidayList from '../components/HolidayList';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';

const HolidayPage = props => (
  <ContentWrapper>
    <PageTitle>Absences</PageTitle>
    <HolidayList {...props} />
  </ContentWrapper>
);

export default HolidayPage;