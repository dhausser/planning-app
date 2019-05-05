import React from 'react'
import PageHeader from '@atlaskit/page-header'
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs'
import Button, { ButtonGroup } from '@atlaskit/button'
import AttachmentIcon from '@atlaskit/icon/glyph/attachment'
import LinkIcon from '@atlaskit/icon/glyph/link'
import PageIcon from '@atlaskit/icon/glyph/page'
import MoreIcon from '@atlaskit/icon/glyph/more'

export default ({ summary }) => {
  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem text="Some project" key="Some project" />
      <BreadcrumbsItem text="Parent page" key="Parent page" />
    </BreadcrumbsStateless>
  )
  const barContent = (
    // <div style={{ display: 'flex' }}>
    <ButtonGroup>
      <Button>{AttachmentIcon()}</Button>
      <Button>{LinkIcon()}</Button>
      <Button>{PageIcon()}</Button>
      <Button>{MoreIcon()}</Button>
    </ButtonGroup>
    // </div>
  )

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>
        {summary}
      </PageHeader>
    </>
  )
}
