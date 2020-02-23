import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { gridSize } from "@atlaskit/theme"
import { priorityIconMap } from "./icon"

const Wrapper = styled.div`
  padding: ${gridSize() - 2}px ${gridSize() - 2}px;
`

export default function Priority({ id }) {
  return (
    <>
      <h6>Priority</h6>
      <Wrapper>{priorityIconMap[id]}</Wrapper>
    </>
  )
}

Priority.propTypes = {
  id: PropTypes.string.isRequired,
}
