import React, { useState } from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';

import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';

import './styles.css';
import styled from 'styled-components';

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

const Wrapper = styled.div`
display: flex;
position: absolute;
top: 0px;
right: 0px;
bottom: 0px;
left: 0px;
`;

const LeftColumn = styled.div`
display: flex;
flex-direction: column;
position: relative;
height: 100%;
width: 320px;
min-height: 0px;
flex: 0 0 auto;
`;

const LeftColumnHeader = styled.div`
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

const LeftColumnContent = styled.div`
position: relative;
flex-direction: column;
display: flex;
margin-left: -10px;
flex: 1 1 auto;
/* overflow: hidden; */
`;

const LeftColumnContentTop1 = styled.div`
display: flex;
/* overflow: hidden; */
`;

const LeftColumnContentTop2 = styled.div`
background-color: rgba(9, 30, 66, 0.25);
margin-left: 10px;
border-left: 1px solid rgb(193, 199, 208);
border-right: 1px solid rgb(193, 199, 208);
`;

const LeftColumnContentBottom = styled.div`
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

const RightPanel = styled.div`
position: relative;
height: 100%;
width: 100%;
min-height: 0px;
overflow: hidden;
`;

// const Box = posed.div({
//   draggable: 'x',
// });

function EpicTable({ epics }) {
  const [issues, setIssues] = useState(epics);

  const onStart = (e) => {
    console.log(e);
  };

  const onEnd = (e) => {
    console.log(e);
  };

  const onDrag = (e) => {
    console.log(e);
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
                <div className="epic-content-flex-item-style" style={{ width: '318px' }}>
                  {epics.map(epic => (
                    <div className="row">
                      <div className="epic-icon">
                        <Epic16Icon />
                      </div>
                      <div className="epic-name">
                        {epic.fields.summary}
                      </div>
                    </div>
                  ))}
                  <div className="epic-bottom-plus-box">
                    <Button appearance="subtle" iconBefore={AddIcon()} onClick={createEpic} />
                  </div>
                  <div style={{ height: '1px', 'background-color': 'rgb(193, 199, 208)' }} />
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
                    <div className="timeline-header-cell" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }}>
                      <div className="timeline-header-text">{month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="timeline-content">
            <div className="timeline-content-1">
              <div className="timeline-content-2" style={{ width: '9579.5px' }}>
                <div className="timeline-content-row">
                  {/* {months.map((month, i) => (
                    <div className="timeline-content-cell">
                      <div className="box box6">{`Month ${i}`}</div>
                    </div>
                  ))} */}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* <div className="header-column">
      <div className="header">Epic</div>
    </div>

    {issues.map(issue => (
      <div className="row" key={issue.id}>
        <div className="header-column">
          <div className="header-cell">
            <div className="epic-icon">
              <Epic16Icon />
            </div>
            <div className="epic-name">
              {issue.fields.summary}
            </div>
          </div>
        </div>
        <div className="content-cell">
          <Box
            className="box"
            onDragStart={onStart}
            onDragEnd={onEnd}
            onValueChange={{ x: onDrag }}
          />
        </div>
      </div>
    ))}

    <div>
      <Button appearance="subtle" iconBefore={AddIcon()} onClick={createEpic} />
    </div> */}

    </div>
  );
}

EpicTable.propTypes = {
  epics: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};


export default EpicTable;
