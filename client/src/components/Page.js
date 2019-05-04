import React from 'react'
import styled from 'styled-components'
import Page, { Grid, GridColumn } from '@atlaskit/page'
import { gridSize } from '@atlaskit/theme'

export const Padding = styled.div`
  margin: ${gridSize() * 4}px ${gridSize() * 8}px;
  padding-bottom: ${gridSize() * 3}px;
`

export const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`

export const AvatarWrapper = styled.div`
  margin-right: 8px;
`

export default props => (
  <Page>
    <Grid>
      <GridColumn>
        <Padding>{props.children}</Padding>
      </GridColumn>
    </Grid>
  </Page>
)
