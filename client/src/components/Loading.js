import React from 'react'
import Spinner from '@atlaskit/spinner'
import styled from 'styled-components'

export const Center = styled.div`
  padding: 100px 0;
  text-align: center;
`

export default () => (
  <Center>
    <Spinner />
  </Center>
)
