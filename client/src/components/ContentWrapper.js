import React from 'react'
import styled from 'styled-components'
import { Grid, GridColumn } from '@atlaskit/page'
import { gridSize } from '@atlaskit/theme'

export const Padding = styled.div`
  margin: ${gridSize() * 4}px ${gridSize() * 8}px;
  padding-bottom: ${gridSize() * 3}px;
`

export const Center = styled.div`
  padding: 100px 0;
  text-align: center;
`

export const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`

export const AvatarWrapper = styled.div`
  margin-right: 8px;
`

const ContentWrapper = ({ children }) => (
  <Grid>
    <GridColumn>
      <Padding>{children}</Padding>
    </GridColumn>
  </Grid>
)
export default ContentWrapper
