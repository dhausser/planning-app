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

  const onStart = (e) => {
    console.log(e);
  };

  const onEnd = (e) => {
    console.log(e);
  };

  const onDrag = (e) => {
    // console.log(e);
  };

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
    <div className="wrapper-1">
      <div className="wrapper-2">

        <div className="container-epic" style={{ width: '320px' }}>
          <div className="epic-header">Epic</div>
          <div className="epic-content">
            <div className="epic-content-flex">
              <div className="epic-content-item">
                <div className="epic-content-flex-item-background" style={{ width: '318px' }}>
                  {epics.map(epic => (
                    <div key={epic.key} className="epic-list-item-base-container" draggable="true">
                      <div key={epic.key} className="epic-list-item-base-content">
                        <div key={epic.key} className="epic-list-item-base-content-row">
                          <div key={epic.key} className="epic-icon">
                            <img
                              className="epic-icon"
                              src="https://solarsystem.atlassian.net/secure/viewavatar?size=medium&avatarId=10307&avatarType=issuetype"
                              alt="Epic issue type"
                            />
                          </div>
                          <p className="epic-text">{epic.fields.summary}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="epic-item-create">
                    <div className="epic-item-create-button" role="button" onClick={createEpic} onKeyUp={createEpic} tabIndex="0">
                      <EmojiCustomIcon />
                    </div>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'rgb(193, 199, 208)' }} />
                </div>
              </div>
            </div>
            <div className="epic-bottom" />
          </div>
        </div>

        <div className="container-timeline">

          <div className="timeline-header">
            <div className="timeline-header-1">
              <div className="timeline-header-2">
                <div className="timeline-header-3">
                  {months.map((month, i) => (
                    <div key={month} className="timeline-header-cell" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }}>
                      <div key={month} className="timeline-header-text">{month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="timeline-content">
            <div className="timeline-content-1">
              <div className="timeline-content-2" style={{ width: '9579.5px' }}>
                <div className="timeline-content-column-container">
                  {months.map((month, i) => <div key={month} className="timeline-content-column-item" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }} />)}
                </div>
                <div className="timeline-column-overlay" />
                {epics.map(epic => (
                  <div key={epic.key} className="timeline-row">
                    <Box
                      className="box"
                      onDragStart={onStart}
                      onDragEnd={onEnd}
                      onValueChange={{ x: onDrag }}
                    />
                  </div>
                ))}
                <div className="timeline-row" />
                <div className="timeline-bottomline" />
              </div>
            </div>
            <div className="timeline-slider-box">
              <div className="timeline-slider-cursor" style={{ transform: 'translateX(0px)' }} />
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
