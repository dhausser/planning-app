import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import styled from 'styled-components';

import { gridSize, fontSize } from '@atlaskit/theme';
import TextArea from '@atlaskit/textarea';
import InlineEdit from '@atlaskit/inline-edit';

export const EDIT_ISSUE = gql`
  mutation EditIssue($id: ID!, $value: String!, $type: String!) {
    editIssue(id: $id, value: $value, type: $type)
  }
`;

const Description: React.FC<{ id: string; description: string }> = ({
  id,
  description,
}) => {
  const [editValue, setEditValue] = useState(description);
  const [editIssue] = useMutation(EDIT_ISSUE);

  return (
    <>
      <h5>Description</h5>
      <InlineEdit
        defaultValue={editValue}
        label="Description"
        editView={(_, ref) => <TextArea ref={ref} />}
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
    </>
  );
};

export default Description;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const minRows = 2;
const textAreaLineHeightFactor = 2.5;

const ReadViewContainer = styled.div`
  line-height: ${(gridSize() * textAreaLineHeightFactor) / fontSize()};
  min-height: ${gridSize() * textAreaLineHeightFactor * minRows}px;
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
  word-break: break-word;
`;
