import React from 'react'
import Spinner from '@atlaskit/spinner'
import Button from '@atlaskit/button'
import styled from 'styled-components'

const Center = styled.div`
  padding: 200px 0;
  text-align: center;
`

export const ButtonLoading = () => (
  <Button key="filters" isLoading appearance="subtle">
    Filters
  </Button>
)

export default () => (
  <Center>
    <Spinner size="large" />
  </Center>
)
