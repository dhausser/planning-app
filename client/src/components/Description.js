import React from 'react'
import InlineEdit from '@atlaskit/inline-edit'

export default ({ description }) => (
  <InlineEdit
    isFitContainerWidthReadView
    label="Description"
    labelHtmlFor="inline-single-edit"
    editView={description}
    readView={description}
    onConfirm={() => {}}
    onCancel={() => {}}
  />
)
