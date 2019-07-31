import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Atlaskit
import PageHeader from '@atlaskit/page-header';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import InlineEdit from '@atlaskit/inline-edit';
import Textfield from '@atlaskit/textfield';
import { gridSize, fontSize } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import LinkIcon from '@atlaskit/icon/glyph/link';
import PageIcon from '@atlaskit/icon/glyph/page';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import MoreIcon from '@atlaskit/icon/glyph/more';
import Button, { ButtonGroup } from '@atlaskit/button';

// Component
import { issuetypeIconMap } from './Icon';

const EDIT_ISSUE = gql`
  mutation EditIssue($id: ID!, $value: String!, $type: String!) {
    editIssue(id: $id, value: $value, type: $type)
  }
`;

const ReadViewContainer = styled.div`
  display: flex;
  font-size: ${fontSize()}px;
  line-height: ${(gridSize() * 2.5) / fontSize()};
  max-width: 100%;
  min-height: ${(gridSize() * 2.5) / fontSize()}em;
  padding: ${gridSize()}px ${gridSize() - 2}px;
  word-break: break-word;
`;

export function copyLink(key) {
  const el = document.createElement('textarea');
  el.value = `https://${process.env.REACT_APP_HOST}/browse/${key}`;
  el.setAttribute('readonly', '');
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

function Summary({ id, summary, issuetype }) {
  const [editValue, setEditValue] = useState(summary);
  const [editIssue] = useMutation(EDIT_ISSUE);

  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem
        href="/issues"
        text="Space Project"
        key="Space project"
      />
      <BreadcrumbsItem
        href={`/issue/${id}`}
        iconBefore={issuetypeIconMap[issuetype.id]}
        text={id}
        key={id}
      />
    </BreadcrumbsStateless>
  );
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
      <Tooltip content={`Copy to clipboard ${id}`}>
        <Button iconBefore={CopyIcon()} onClick={() => copyLink(id)} />
      </Tooltip>
      <Button iconBefore={MoreIcon()} />
    </ButtonGroup>
  );

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>
        <InlineEdit
          defaultValue={editValue}
          editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
          readView={() => (
            <ReadViewContainer>
              {editValue || 'Click to enter value'}
            </ReadViewContainer>
          )}
          onConfirm={(value) => {
            setEditValue(value);
            editIssue({ variables: { id, value, type: 'summary' } });
          }}
        />
      </PageHeader>
    </>
  );
}

Summary.propTypes = {
  id: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  issuetype: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Summary;
