import React, { useState } from 'react';
import posed from 'react-pose';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import './styles.css';

import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import months from './sample-data';

const HeadlineRow = (epic, i) => (
  <div key={epic.key} className="row-10012 sc-cGCqpu fgAcZb" data-test-id="roadmap.common.components.table.components.list-item.base.container" draggable="true">
    {i > 0 && (
    <div className="sc-fiBOuc gBlnCF" data-test-id={`roadmap.common.components.table.components.list-item.base.inline-create-button-${i}`} role="button" aria-label="Inline issue create" tabIndex="0">
      <div className="sc-fKPMAj bTwOsv" />
    </div>
    )}
    <div className="sc-bpKEQf MYjxS" data-test-id={`roadmap.common.components.table.components.list-item.base.content-container-${i}`} tabIndex="0">
      <div className="sc-fYvWhK hHNvRV">
        <img
          className="sc-LAuEU ePowzo"
          src="https://solarsystem.atlassian.net/secure/viewavatar?size=medium&avatarId=10307&avatarType=issuetype"
          alt="Epic issue type"
        />
        <p className="sc-bcdylZ kzvagL">{epic.fields.summary}</p>
      </div>
    </div>
  </div>
);

function Headline({ epics }) {
  const [issues, setIssues] = useState(epics);

  const createEpic = () => {
    const { length } = issues;
    const num = length + 1;
    const issue = {
      id: `${num}`,
      key: `ST-${num}`,
      fields: {
        summary: `Epic Number ${num}`,
      },
    };
    setIssues([...issues, issue]);
  };

  return (
    <HeadlineContainer data-test-id="roadmap.common.components.table.components.list.container" width="320" style={{ width: '320px' }}>
      <div className="sc-hBAMER LDeNe">
        <p className="sc-bPzAnn rncm">Epic</p>
        <div className="sc-inbiTh eqQJjt" />
      </div>

      <div className="sc-iipuKH cNqgUs">
        <div style={{ display: 'flex', overflow: 'hidden' }}>
          <div className="sc-nUItV fryQcz" data-test-id="roadmap.common.components.table.components.list.hidden-scrollbar">
            <div className="sc-gsxalj hoLpFJ" width="318" style={{ width: '318px' }}>
              {epics.map(HeadlineRow)}
              <div className="sc-czDwQe fpLLUJ">
                <div className="sc-hfsWMF akHwS" data-test-id="roadmap.common.components.table.components.list.items.create-item.button" role="button" aria-label="Create issue last" onClick={createEpic} onKeyUp={createEpic} tabIndex="0">
                  <EmojiCustomIcon className="dqqHMN" />
                </div>
              </div>
              <div className="sc-gOCRIc hfPzIv" />
            </div>
          </div>
        </div>
        <div className="sc-bstyWg fFEVEI" width="318" style={{ width: '318px' }} />
      </div>
    </HeadlineContainer>
  );
}

const Box = posed.div({
  draggable: 'x',
});

const TimelineContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0px;
  overflow: hidden;
`;

const TimelineColumnHeader = (month, i) => (
  <div key={month} className="rWwYB" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }}>
    <small className="dRfJrE">{month}</small>
  </div>
);

const TimelineColumn = (month, i) => (
  <div key={month} className="sc-liPmeQ inHpzx" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }} />
);


const TimelineHeader = () => (
  <div className="dkFNrj">
    <div className="wWWya">
      <div className="hTdzhs" width="9579.499999901622" style={{ width: '9579.5px' }}>
        <div className="cZzQw">
          {months.map(TimelineColumnHeader)}
        </div>
      </div>
    </div>
  </div>
);

const TimelineRow = (epic) => {
  const onStart = () => {};
  const onEnd = () => {};
  const onDrag = () => {};

  return (
    <div key={epic.key} className="row-10012 sc-hqFvvW hQBlfE">
      <Box
        className="sc-buGlAa feIyeE"
        style={{ width: '200px' }}
        onDragStart={onStart}
        onDragEnd={onEnd}
        onValueChange={{ x: onDrag }}
        onMouseOver={() => {}}
        onFocus={() => {}}
      >
        <div className="sc-fJwQoQ esCmBo" orientation="left">
          <div className="sc-flvzOl chhxgO" />
        </div>
        <div className="sc-fJwQoQ kiQuXo" orientation="right">
          <div className="sc-flvzOl chhxgO" />
        </div>
      </Box>
    </div>
  );
};

const TimelineContent = ({ epics }) => (
  <div className="sc-haEqAx fsrySA">
    <div className="sc-tVThF rifCR" id="sr-timeline">
      <div className="sc-dENsGg kdpnGG" width="9579.499999901622" style={{ width: '9579.5px' }}>
        <div className="sc-gbuiJB iMnhyT">
          {months.map(TimelineColumn)}
        </div>
        <div className="sc-kBMPsl fWSXz" />
        <div className="sc-dgAbBl laChM">
          {epics.map(TimelineRow)}
        </div>
        <div className="sc-jhLVlY bIZLLn" />
        <div className="sc-gOCRIc hfPzIv" />
      </div>
    </div>
    <div className="idQEUl">
      <div className="hFbkGU" size="39" style={{ transform: 'translateX(0px)' }} />
    </div>
    <div className="gWouFt">
      <div className="iXyYRM" size="99" style={{ transform: 'translateX(0px)' }} />
    </div>
  </div>
);

const InlineDragIndicator = () => (
  <div className="inline-drag-indicator inline-drag-indicator-top jMrzDz">
    <div className="grZjms" />
  </div>
);

const InlineCreate = () => (
  <div className="inline-create-button eaYLQY">
    <div className="hKwvKb">
      <div className="kkkFIk" />
      <div className="cpqXQZ">
        <div className="bIeuYl">
          <EmojiCustomIcon className="bcqBjl" />
        </div>
      </div>
    </div>
  </div>
);


export default function Timeline({ epics }) {
  return (
    <Wrapper>
      <Wrapper2>
        <Headline epics={epics} />
        <TimelineContainer>
          <TimelineHeader />
          <TimelineContent epics={epics} />
          <FDEAOq />
          <CvTvEa />
        </TimelineContainer>
        <FjLAd />
        <InlineDragIndicator />
        <InlineCreate />
      </Wrapper2>
    </Wrapper>
  );
}

Headline.propTypes = {
  epics: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};

Timeline.propTypes = {
  epics: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};

TimelineContent.propTypes = {
  epics: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};

/**
 * Styled Components
 */

const Wrapper = styled.div`
  position: relative;
  margin-top: 24px;
  flex: 1 1 auto;
`;

const Wrapper2 = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const HeadlineContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  min-height: 0px;
  flex: 0 0 auto;
`;

const FDEAOq = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0px;
  overflow: hidden;
`;

const CvTvEa = styled.div`
  position: absolute;
  pointer-events: none;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 11;
  clip: rect(0px, auto, auto, 0px);
  clip-path: inset(0px);
`;

const FjLAd = styled.div`
  position: fixed;
  pointer-events: none;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 11;
`;
