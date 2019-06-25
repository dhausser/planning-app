import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from '@atlaskit/page-header';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';

import AttachmentIcon from '@atlaskit/icon/glyph/attachment';
import LinkIcon from '@atlaskit/icon/glyph/link';
import PageIcon from '@atlaskit/icon/glyph/page';
import MoreIcon from '@atlaskit/icon/glyph/more';

import Icon from './Icon';

function Summary({ id, summary, type }) {
  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem
        href="/issues"
        text="Space Project"
        key="Space project"
      />
      <BreadcrumbsItem
        href={`/issue/${id}`}
        iconBefore={Icon[type]}
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
      <Button iconBefore={MoreIcon()} />
    </ButtonGroup>
  );

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>
        {summary}
      </PageHeader>
    </>
  );
}

Summary.propTypes = {
  id: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Summary;
