import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Date, Color } from '@atlaskit/date';
import EmptyState from '@atlaskit/empty-state';
import { colors, borderRadius } from '@atlaskit/theme';
import styled, { css } from 'styled-components';
import Loading from '../Loading';

const GET_ABSENCES = gql`
  query absenceList($id: ID!, $versionId: String) {
    filter @client {
      version {
        id @export(as: "versionId")
      }
    }
    absences(id: $id, versionId: $versionId) {
      key
      date
    }
  }
`;

const SelectableDate = styled(Date)`
  ${props => (props.selected
    ? css`
          display: 'relative';
          &:before {
            content: '';
            border: 2px solid ${colors.B200};
            display: 'absolute';
            background: transparent;
            border-radius: ${borderRadius()}px;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
        `
    : null)};
`;

function AbsencesList({ resourceId }) {
  const { data, loading, error } = useQuery(GET_ABSENCES, {
    variables: { id: resourceId },
    fetchPolicy: 'cache-first',
  });

  if (loading) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  return (
    <div>
      <h4>Absences</h4>
      {data.absences.map(absence => (
        <p key={absence.date}>
          <SelectableDate value={absence.date} color="blue" />
        </p>
      ))}
    </div>
  );
}

AbsencesList.propTypes = {
  resourceId: PropTypes.string.isRequired,
};

export default AbsencesList;
