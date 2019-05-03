import React from 'react'
import styled from 'styled-components'
import Page, { Grid, GridColumn } from '@atlaskit/page'
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

export const Title = styled.h1`
  margin-bottom: ${gridSize() * 2}px;
`

export default ({ title, children }) => (
  <Page>
    <Grid>
      <GridColumn>
        <Padding>
          <Title>{title}</Title>
          {children}
        </Padding>
      </GridColumn>
    </Grid>
  </Page>
)
