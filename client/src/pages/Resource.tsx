import React, { useEffect, ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import TextField from '@atlaskit/textfield';
import { Status, Color } from '@atlaskit/status/element';
import styled from 'styled-components';
import {
  projectHomeView,
  Layout,
  ProjectFilter,
  VersionFilter,
  StatusFilter,
  IssueTable,
  Nameplate,
} from '../components';
import { ResourceProps } from '../types';
import useAbsences from '../lib/useAbsences';

const Container = styled.div`
  width: 140px;
`;

const StatusInParagraph = ({
  text,
  color,
}: {
  text: string;
  color: Color;
}): ReactElement => (
  <p>
    <Status text={text} color={color} />
  </p>
);

const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flexBasis: 150, marginRight: 8 }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <ProjectFilter />
    <VersionFilter />
    <StatusFilter />
  </div>
);

function Absences({ id }: { id?: string }): ReactElement {
  const absences = useAbsences(id);
  return (
    <Container>
      <h1>Absences</h1>
      {absences.map((absence) => (
        <StatusInParagraph
          key={absence.date}
          text={absence.date}
          color="blue"
        />
      ))}
    </Container>
  );
}

function Resource({ navigationViewController }: ResourceProps): ReactElement {
  const { id } = useParams();

  useEffect(() => {
    navigationViewController.setView(projectHomeView.id);
  }, [navigationViewController]);

  return (
    <Layout>
      <PageHeader bottomBar={barContent}>
        <Nameplate id={id as string} />
      </PageHeader>
      <IssueTable resourceId={id} />
      <Absences id={id} />
    </Layout>
  );
}

export default withNavigationViewController(Resource);
