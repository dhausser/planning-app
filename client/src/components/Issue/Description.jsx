import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import TextArea from '@atlaskit/textarea';
import { gridSize, fontSize } from '@atlaskit/theme';

import InlineEdit from '@atlaskit/inline-edit';
import styled from 'styled-components';

const EDIT_ISSUE = gql`
  mutation EditIssue($id: ID!, $value: String!, $type: String!) {
    editIssue(id: $id, value: $value, type: $type)
  }
`;

const minRows = 2;
const textAreaLineHeightFactor = 2.5;
const ReadViewContainer = styled.div`
  line-height: ${(gridSize() * textAreaLineHeightFactor) / fontSize()};
  min-height: ${gridSize() * textAreaLineHeightFactor * minRows}px;
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
  word-break: break-word;
`;

function Description({ id, description }) {
  const [editValue, setEditValue] = useState(description);
  const [editIssue] = useMutation(EDIT_ISSUE);

  return (
    <div
      style={{
        padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
        width: '70%',
      }}
    >
      <InlineEdit
        defaultValue={editValue}
        label="Description"
        editView={(fieldProps, ref) => (
        // @ts-ignore - textarea does not currently correctly pass through ref as a prop
          <TextArea {...fieldProps} ref={ref} />
        )}
        readView={() => (
          <ReadViewContainer>
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={(value) => {
          setEditValue(value);
          editIssue({ variables: { id, value, type: 'description' } });
        }}
        keepEditViewOpenOnBlur
        readViewFitContainerWidth
      />
    </div>
  );
}

Description.defaultProps = {
  description: '',
};

Description.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default Description;
