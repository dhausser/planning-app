import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import { gridSize } from "@atlaskit/theme"
import { Status } from "@atlaskit/status/element"
import { statusCatecoryColorMap } from "./icon"

const Wrapper = styled.div`
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
`

const StatusInParagraph = ({ text, color }) => (
  <Status text={text} color={color} />
)

export default function StatusComponent({ name, statusCategory }) {
  const color = statusCatecoryColorMap[statusCategory.id]
  return (
    <div>
      <h6>STATUS</h6>
      <Wrapper>
        <StatusInParagraph text={name} color={color} />
      </Wrapper>
    </div>
  )
}

StatusInParagraph.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

StatusComponent.propTypes = {
  name: PropTypes.string.isRequired,
  statusCategory: PropTypes.objectOf(PropTypes.objectOf).isRequired,
}
