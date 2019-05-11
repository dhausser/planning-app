import React from 'react'

import PageHeader from '@atlaskit/page-header'
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs'
import Button, { ButtonGroup } from '@atlaskit/button'
import Tooltip from '@atlaskit/tooltip'

import AttachmentIcon from '@atlaskit/icon/glyph/attachment'
import LinkIcon from '@atlaskit/icon/glyph/link'
import PageIcon from '@atlaskit/icon/glyph/page'
import MoreIcon from '@atlaskit/icon/glyph/more'

import { getIcon } from './Icon'

export default ({ id, summary, type }) => {
  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem
        href="/issues"
        text="Space Project"
        key="Space project"
      />
      <BreadcrumbsItem
        href={`/issue/${id}`}
        iconBefore={getIcon[type]}
        text={id}
        key={id}
      />
    </BreadcrumbsStateless>
  )
  const barContent = (
    <ButtonGroup>
      <Tooltip content="Add attachement">
        <Button iconBefore={AttachmentIcon()} />
      </Tooltip>
      <Tooltip content="Link issue">
        <Button iconBefore={LinkIcon()} />
      </Tooltip>
      <Tooltip content="Link a Confluence page">
        <Button iconBefore={PageIcon()} />
      </Tooltip>
      <Button iconBefore={MoreIcon()} />
    </ButtonGroup>
  )

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>
        {summary}
      </PageHeader>
    </>
  )
}
