import React, { useState } from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import EmojiCustomIcon from '@atlaskit/icon/glyph/emoji/custom';
import './styles.css';

const months = [
  "Jan '18",
  "Feb '18",
  "Mar '18",
  "Apr '18",
  "May '18",
  "Jun '18",
  "Jul '18",
  "Aug '18",
  "Sep '18",
  "Oct '18",
  "Nov '18",
  "Dec '18",
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
  "Jan '20",
  "Feb '20",
  "Mar '20",
  "Apr '20",
  "May '20",
  "Jun '20",
  "Jul '20",
  "Aug '20",
  "Sep '20",
  "Oct '20",
  "Nov '20",
  "Dec '20",
  "Jan '21",
  "Feb '21",
  "Mar '21",
  "Apr '21",
  "May '21",
  "Jun '21",
  "Jul '21",
  "Aug '21",
  "Sep '21",
  "Oct '21",
  "Nov '21",
  "Dec '21",
];

const Box = posed.div({
  draggable: 'x',
});

function EpicTable({ epics }) {
  const [issues, setIssues] = useState(epics);

  const onStart = () => {};

  const onEnd = () => {};

  const onDrag = () => {};

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
    <div className="sc-jjgyjb jUAyze">
      <div className="default">
        <div className="sc-dfRKBO bVGEsC">
          <div className="sc-eXfwOT hDgjOI" data-test-id="roadmap.common.components.table.components.list.container" width="320" style={{ width: '320px' }}>
            <div className="sc-hBAMER LDeNe">
              <p className="sc-bPzAnn rncm">Epic</p>
              <div className="sc-inbiTh eqQJjt" />
            </div>
            <div className="sc-iipuKH cNqgUs">
              <div style={{ display: 'flex', overflow: 'hidden' }}>
                <div className="sc-nUItV fryQcz" data-test-id="roadmap.common.components.table.components.list.hidden-scrollbar">
                  <div className="sc-gsxalj hoLpFJ" width="318" style={{ width: '318px' }}>
                    {epics.map(epic => (
                      <div key={epic}>
                        <div className="row-10012 sc-cGCqpu fgAcZb" data-test-id="roadmap.common.components.table.components.list-item.base.container" draggable="true">
                          <div className="sc-bpKEQf MYjxS" data-test-id="roadmap.common.components.table.components.list-item.base.content-container-0" tabIndex="0">
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
                      </div>
                    ))}
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
          </div>
          <div className="cPRRFk">
            <div className="dkFNrj">
              <div className="wWWya">
                <div className="hTdzhs" width="9579.499999901622" style={{ width: '9579.5px' }}>
                  <div className="cZzQw">
                    {months.map((month, i) => (
                      <div key={month} className="rWwYB" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }}>
                        <small className="dRfJrE">{month}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="sc-haEqAx fsrySA">
              <div className="sc-tVThF rifCR" id="sr-timeline">
                <div className="sc-dENsGg kdpnGG" width="9579.499999901622" style={{ width: '9579.5px' }}>
                  <div className="sc-gbuiJB iMnhyT">
                    {months.map((month, i) => (
                      <div key={month} className="sc-liPmeQ inHpzx" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }} />
                    ))}
                  </div>
                  <div className="sc-kBMPsl fWSXz" />
                  <div className="sc-dgAbBl laChM">
                    {epics.map(epic => (
                      <div key={epic.key}>
                        <div className="row-10012 sc-hqFvvW hQBlfE">
                          {/* <div className="sc-buGlAa feIyeE" style={{ left: '0.01%', right: '0.0000000001%' }} draggable="true"> */}
                          <Box
                            className="sc-buGlAa feIyeE"
                            style={{ width: '200px' }}
                            onDragStart={onStart}
                            onDragEnd={onEnd}
                            onValueChange={{ x: onDrag }}
                          >
                            <div className="sc-fJwQoQ esCmBo" orientation="left">
                              <div className="sc-flvzOl chhxgO" />
                            </div>
                            <div className="sc-fJwQoQ kiQuXo" orientation="right">
                              <div className="sc-flvzOl chhxgO" />
                            </div>
                          </Box>
                          {/* </div> */}
                        </div>
                      </div>
                    ))}
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
            <div className="fDEAOq" />
            <div className="cvTvEa" />
          </div>
          <div className="FjLAd" />
          <div className="inline-drag-indicator inline-drag-indicator-top jMrzDz">
            <div className="grZjms" />
          </div>
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
        </div>
      </div>
    </div>
  );
}

EpicTable.propTypes = {
  epics: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};


export default EpicTable;
