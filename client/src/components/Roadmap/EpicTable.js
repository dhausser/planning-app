import React, { useState } from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';

import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';

import './styles.css';
import styled from 'styled-components';

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

  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="top-wrapper">
      <div className="wrapper">

        <div className="epic-panel">
          <div className="epic-header">Epic</div>
          <div className="box box1">1</div>
          <div className="box box2">2</div>
          <div className="box box3">3</div>
          <div className="box box4">4</div>
          <div className="box box5">5</div>
        </div>
        <div className="calendar">
          <div className="calendar-header">
            <div className="calendar-1">
              <div className="calendar-2">
                <div className="calendar-3">
                  {months.map((month, i) => (
                    <div className="calendar-4" style={{ left: `calc(${i} * 2.75%)`, right: `calc(100% - 2.75% * ${i + 1})` }}>
                      <div className="calendar-5">{`${month} '19`}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="box box6">6</div>
          <div className="box box7">7</div>
          <div className="box box8">8</div>
          <div className="box box9">9</div>
          <div className="box box10">10</div>
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
    </div>
  );
}

EpicTable.propTypes = {
  epics: PropTypes.arrayOf(PropTypes.objectOf).isRequired,
};


export default EpicTable;
