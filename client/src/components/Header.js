import React from 'react'
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs'
import Button, { ButtonGroup } from '@atlaskit/button'
import TextField from '@atlaskit/textfield'

import PageHeader from '@atlaskit/page-header'

import Filters from './Filters'

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </BreadcrumbsStateless>
)
const actionsContent = (
  <ButtonGroup>
    <Button appearance="primary">Primary Action</Button>
    <Button>Default</Button>
    <Button>...</Button>
  </ButtonGroup>
)
const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: '0 0 200px' }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <Filters />
  </div>
)

export default ({ title }) => (
  <>
    <PageHeader
      breadcrumbs={breadcrumbs}
      actions={actionsContent}
      bottomBar={barContent}
    >
      {title}
    </PageHeader>
  </>
)
