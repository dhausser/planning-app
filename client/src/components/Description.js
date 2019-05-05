import React, { useState } from 'react'
import { Editor, CollapsedEditor } from '@atlaskit/editor-core'

export default function CollapsibleEditor({ description }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const expandEditor = () => setIsExpanded(true)

  const collapseEditor = () => setIsExpanded(false)

  const onSave = () => setIsExpanded(false)

  return (
    <>
      <h4>Description</h4>
      <CollapsedEditor
        placeholder={description}
        isExpanded={isExpanded}
        onFocus={expandEditor}
      >
        <Editor
          // appearance="full-page"
          onSave={onSave}
          onCancel={collapseEditor}
          contentComponents={description}
        />
      </CollapsedEditor>
    </>
  )
}
