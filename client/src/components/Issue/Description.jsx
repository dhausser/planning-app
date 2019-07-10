import React from 'react';
import PropTypes from 'prop-types';

/**
 *
 * @param {TODO}
 */
// import { Editor, CollapsedEditor } from '@atlaskit/editor-core'

function Description({ description }) {
  // const [isExpanded, setIsExpanded] = useState(false)
  // const expandEditor = () => setIsExpanded(true)
  // const collapseEditor = () => setIsExpanded(false)
  // const onSave = () => setIsExpanded(false)

  return (
    <>
      <h5>Description</h5>
      <p>{description}</p>
      {/* <CollapsedEditor
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
      </CollapsedEditor> */}
    </>
  );
}

Description.defaultProps = {
  description: '',
};

Description.propTypes = {
  description: PropTypes.string,
};

export default Description;
