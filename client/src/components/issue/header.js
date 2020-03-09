import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import LinkIcon from '@atlaskit/icon/glyph/link';
import PageIcon from '@atlaskit/icon/glyph/page';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import MoreIcon from '@atlaskit/icon/glyph/more';
import InlineEdit from '@atlaskit/inline-edit';
import { colors } from '@atlaskit/theme';
import PageHeader from '@atlaskit/page-header';
import { issuetypeIconMap } from './icon';

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

const EDIT_ISSUE = gql`
  mutation EditIssue($id: ID!, $value: String!, $type: String!) {
    editIssue(id: $id, value: $value, type: $type)
  }
`;

const ReadView = styled.div`
  font-size: 24px;
  font-weight: 500;
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: 8px 6px;
`;

const EditView = styled.input`
  font-size: 24px;
  font-weight: 500;
  box-sizing: border-box;
  cursor: inherit;
  outline: none;
  padding: 6px 6px;
  width: 100%;
  border: 2px solid ${colors.N40};
  border-radius: 3px;

  :focus {
    border: 2px solid ${colors.B100};
  }
`;

function Title({ id, summary }) {
  const [editValue, setEditValue] = useState(summary);
  const [editIssue] = useMutation(EDIT_ISSUE);
  return (
    <InlineEdit
      readView={() => <ReadView>{editValue}</ReadView>}
      editView={(props, ref) => <EditView {...props} innerRef={ref} />}
      defaultValue={editValue}
      onConfirm={(value) => {
        setEditValue(value);
        editIssue({ variables: { id, value, type: 'summary' } });
      }}
    />
  );
}

function Header({ id, summary, issuetype }) {
  const breadcrumbs = (
    <BreadcrumbsStateless onExpand={() => { }}>
      <BreadcrumbsItem text="Some project" key="Some project" />
      <BreadcrumbsItem text={id} key={id} iconBefore={issuetypeIconMap[issuetype.id]} />
    </BreadcrumbsStateless>
  );
  const barContent = (
    <div style={{ display: 'flex' }}>
      <div style={{ flexBasis: 150, marginRight: 8 }}>
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
      </div>
    </div>
  );
  return (
    <PageHeader
      breadcrumbs={breadcrumbs}
      bottomBar={barContent}
      disableTitleStyles
    >
      <Title id={id} summary={summary} />
    </PageHeader>
  );
}

Title.propTypes = {
  id: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
};

Header.propTypes = {
  id: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  issuetype: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Header;
