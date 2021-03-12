import React, { useState, ReactElement } from "react";
import { useMutation } from "@apollo/client";
import styled from "styled-components";

import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import Button, { ButtonGroup } from "@atlaskit/button";
import Tooltip from "@atlaskit/tooltip";
import AttachmentIcon from "@atlaskit/icon/glyph/attachment";
import LinkIcon from "@atlaskit/icon/glyph/link";
import PageIcon from "@atlaskit/icon/glyph/page";
import CopyIcon from "@atlaskit/icon/glyph/copy";
import MoreIcon from "@atlaskit/icon/glyph/more";
import InlineEdit from "@atlaskit/inline-edit";
import { colors } from "@atlaskit/theme";
import PageHeader from "@atlaskit/page-header";
import { issuetypeIconMap } from "./Icon";
import { EDIT_ISSUE } from "./Description";

interface TitleProps {
  id: string;
  summary: string;
}

interface HeaderProps {
  id: string;
  summary: string;
  issuetype: { id: string };
}

const Title: React.FC<TitleProps> = ({ id, summary }) => {
  const [editValue, setEditValue] = useState(summary);
  const [editIssue] = useMutation(EDIT_ISSUE);
  return (
    <InlineEdit
      readView={(): ReactElement => <ReadView>{editValue}</ReadView>}
      editView={(props, ref): ReactElement => (
        <EditView {...props} innerRef={ref} />
      )}
      defaultValue={editValue}
      onConfirm={(value): void => {
        setEditValue(value);
        editIssue({ variables: { id, value, type: "summary" } });
      }}
    />
  );
};

export function copyLink(key: string): void {
  const el = document.createElement("textarea");
  el.value = `${process.env.REACT_APP_BASE_URL}/browse/${key}`;
  el.setAttribute("readonly", "");
  // el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

const Header: React.FC<HeaderProps> = ({ id, summary, issuetype }) => {
  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem text="Some project" key="Some project" />
      <BreadcrumbsItem
        text={id}
        key={id}
        iconBefore={issuetypeIconMap[issuetype.id]}
      />
    </BreadcrumbsStateless>
  );
  const barContent = (
    <div style={{ display: "flex" }}>
      <div style={{ flexBasis: 150, marginRight: 8 }}>
        <ButtonGroup>
          <Tooltip content="Add attachement">
            <Button iconBefore={<AttachmentIcon label="Attachement" />} />
          </Tooltip>
          <Tooltip content="Link issue">
            <Button iconBefore={<LinkIcon label="Link" />} />
          </Tooltip>
          <Tooltip content="Link a Confluence page">
            <Button iconBefore={<PageIcon label="Page" />} />
          </Tooltip>
          <Tooltip content={`Copy to clipboard ${id}`}>
            <Button
              iconBefore={<CopyIcon label="Copy" />}
              onClick={(): void => copyLink(id)}
            />
          </Tooltip>
          <Button iconBefore={<MoreIcon label="More" />} />
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
};

export default Header;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

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
