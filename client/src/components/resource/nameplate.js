import React from "react"
import { gql, useQuery } from "@apollo/client"
import styled from "styled-components"
import PropTypes from "prop-types"
import Avatar from "@atlaskit/avatar"

const GET_ASSIGNEE = gql`
  query Assignee($id: ID!) {
    user(id: $id) {
      displayName
      avatarUrls {
        large
      }
    }
  }
`

export default function Nameplate({ id }) {
  const { loading, error, data } = useQuery(GET_ASSIGNEE, { variables: { id } })

  if (loading) return null
  if (error) return `Error! ${error}`

  if (data) {
    return (
      <NameWrapper>
        <AvatarWrapper>
          <Avatar
            name={data.user.displayName}
            size="large"
            src={data.user.avatarUrls.large}
          />
        </AvatarWrapper>
        {data.user.displayName}
      </NameWrapper>
    )
  }

  return <NameWrapper>Assignee</NameWrapper>
}

Nameplate.propTypes = {
  id: PropTypes.string.isRequired,
}

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const NameWrapper = styled.span`
  display: flex;
  align-items: center;
`

const AvatarWrapper = styled.div`
  margin-right: 8px;
`
