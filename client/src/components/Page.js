import React from 'react'
import styled from 'styled-components'
import Page, { Grid, GridColumn } from '@atlaskit/page'
import { gridSize } from '@atlaskit/theme'
import Header from './Header'

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

export default ({ title, children }) => (
  <Page>
    <Grid>
      <GridColumn>
        <Padding>
          <Header title={title} />
          {children}
        </Padding>
      </GridColumn>
    </Grid>
  </Page>
)
