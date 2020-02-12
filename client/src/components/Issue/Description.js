import React, { useState } from "react"

import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

import PropTypes from "prop-types"
import styled from "styled-components"

import { gridSize, fontSize } from "@atlaskit/theme"
import TextArea from "@atlaskit/textarea"
import InlineEdit from "@atlaskit/inline-edit"

const EDIT_ISSUE = gql`
  mutation EditIssue($id: ID!, $value: String!, $type: String!) {
    editIssue(id: $id, value: $value, type: $type)
  }
`

const minRows = 2
const textAreaLineHeightFactor = 2.5
const ReadViewContainer = styled.div`
  line-height: ${(gridSize() * textAreaLineHeightFactor) / fontSize()};
  min-height: ${gridSize() * textAreaLineHeightFactor * minRows}px;
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
  word-break: break-word;
`

function Description({ id, description }) {
  const [editValue, setEditValue] = useState(description)
  const [editIssue] = useMutation(EDIT_ISSUE)

  return (
    <>
      <h5>Description</h5>
      <InlineEdit
        defaultValue={editValue}
        label="Description"
        editView={(fieldProps, ref) => <TextArea {...fieldProps} ref={ref} />}
        readView={() => (
          <ReadViewContainer>
            {editValue || "Click to enter value"}
          </ReadViewContainer>
        )}
        onConfirm={value => {
          setEditValue(value)
          editIssue({ variables: { id, value, type: "description" } })
        }}
        keepEditViewOpenOnBlur
        readViewFitContainerWidth
      />
    </>
  )
}

Description.defaultProps = {
  description: "",
}

Description.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
}

export default Description
