import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import { ScrollSyncPane } from 'react-scroll-sync';
import { RowContainer, CreateButton } from './Frame';

export default function Headline({ issues }) {
  function createEpic() {
    // const { length } = issues;
    // const num = length + 1;
    // const issue = {
    //   id: `${num}`,
    //   key: `ST-${num}`,
    //   fields: {
    //     summary: `Epic Number ${num}`,
    //   },
    // };
    // setIssues([...issues, issue]);
  }

  return (
    <HeadlineContainer
      data-test-id="roadmap.common.components.table.components.list.container"
      width="320"
      style={{ width: '320px' }}
    >
      <EpicTitleWrapper>
        <EpicTitle>Epic</EpicTitle>
        <EpicTitleBottom />
      </EpicTitleWrapper>
      <HeaderRowWrapper>
        <div style={{ display: 'flex', overflow: 'hidden' }}>
          <ScrollSyncPane>
            <HeaderRowScrollBar data-test-id="roadmap.common.components.table.components.list.hidden-scrollbar">
              <HeaderRowScrollBarWidth width="318" style={{ width: '318px' }}>
                {issues.map((epic, i) => (
                  <RowContainer
                    key={epic.key}
                    data-test-id="roadmap.common.components.table.components.list-item.base.container"
                  >
                    {i > 0 && (
                      <InlineCreateWrapper
                        data-test-id={`roadmap.common.components.table.components.list-item.base.inline-create-button-${i}`}
                        role="button"
                        aria-label="Inline issue create"
                        tabIndex="0"
                      >
                        <InlineCreateButton />
                      </InlineCreateWrapper>
                    )}
                    <HeadlineRowContentWrapper
                      data-test-id={`roadmap.common.components.table.components.list-item.base.content-container-${i}`}
                    >
                      <HeadlineRowContent>
                        <EpicIcon
                          src="https://solarsystem.atlassian.net/secure/viewavatar?size=medium&avatarId=10307&avatarType=issuetype"
                          alt="Epic issue type"
                        />
                        <StyledParagraph>{epic.fields.summary}</StyledParagraph>
                      </HeadlineRowContent>
                    </HeadlineRowContentWrapper>
                  </RowContainer>
                ))}
                <CreateButtonWrapper>
                  <CreateButton
                    data-test-id="roadmap.common.components.table.components.list.items.create-item.button"
                    role="button"
                    aria-label="Create issue last"
                    onClick={createEpic}
                    onKeyUp={createEpic}
                    tabIndex="0"
                  >
                    <EmojiCustomIcon className="icon" />
                  </CreateButton>
                </CreateButtonWrapper>
                <div style={{ height: '1px', backgroundColor: 'rgb(193, 199, 208)' }} />
              </HeaderRowScrollBarWidth>
            </HeaderRowScrollBar>
          </ScrollSyncPane>
        </div>
        <HeaderRowBorder width="318" style={{ width: '318px' }} />
      </HeaderRowWrapper>
    </HeadlineContainer>
  );
}

Headline.defaultProps = {
  issues: [],
};

Headline.propTypes = {
  issues: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string.isRequired }),
  ),
};

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const HeadlineContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  min-height: 0px;
  flex: 0 0 auto;
`;

const InlineCreateWrapper = styled.div`
  position: absolute;
  top: -5px;
  left: -10px;
  right: 0px;
  height: 10px;
  /* cursor: pointer; */
  z-index: 1;
  outline: none;
`;

const InlineCreateButton = styled.div`
  position: relative;
  top: -5px;
  left: 0px;
  right: 0px;
  height: 20px;
  width: 20px;
  /* cursor: pointer; */
`;

const HeadlineRowContentWrapper = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-flex: 1;
  flex-grow: 1;
  height: 100%;
  padding-left: 24px;
  padding-right: 16px;
  overflow: hidden;
  outline: none;
  transition: box-shadow 0.2s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
`;

const HeadlineRowContent = styled.div`
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
`;

const HeaderRowWrapper = styled.div`
  position: relative;
  flex-direction: column;
  display: flex;
  margin-left: -10px;
  flex: 1 1 auto;
  overflow: hidden;
`;

const HeaderRowScrollBar = styled.div`
  width: 100%;
  overflow-y: auto;
  padding-right: 50px;
  flex: 0 0 auto;
`;

const HeaderRowScrollBarWidth = styled.div`
  background-color: rgba(9, 30, 66, 0.25);
  margin-left: 10px;
  border-left: 1px solid rgb(193, 199, 208);
  border-right: 1px solid rgb(193, 199, 208);
`;

const HeaderRowBorder = styled.div`
  margin-left: 10px;
  flex: 1 1 auto;
  border-left: 1px solid rgb(193, 199, 208);
  border-right: 1px solid rgb(193, 199, 208);
`;

const EpicTitleWrapper = styled.div`
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  background-color: rgb(244, 245, 247);
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(193, 199, 208) rgb(193, 199, 208) rgb(223, 225, 230);
  border-image: initial;
  border-bottom: 1px solid rgb(223, 225, 230);
  flex: 0 0 auto;
  padding: 0px 16px 0px 24px;
  border-radius: 3px 0px 0px;
`;

const EpicTitle = styled.p`
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0px;
  overflow: hidden;
`;

const EpicTitleBottom = styled.div`
  position: absolute;
  right: -3px;
  top: 0px;
  width: 8px;
  height: 100%;
  /* cursor: ew-resize; */
  z-index: 2;
  opacity: 0;
  transition: opacity 0.1s ease 0s;
`;

const EpicIcon = styled.img`
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  border-radius: 3px;
`;

const CreateButtonWrapper = styled.div`
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 40px;
  background-color: rgb(255, 255, 255);
  -webkit-box-pack: center;
  justify-content: center;
  box-sizing: border-box;
  transition: background-color 100ms linear 0s;
  padding: 0px 8px;
`;

const StyledParagraph = styled.p`
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0px 0px 0px 8px;
  overflow: hidden;
`;
