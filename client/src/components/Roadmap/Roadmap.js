import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import styled from 'styled-components';
import './styles.css';
import data from './sample-data';
// Atlaskit
import { withNavigationViewController } from '@atlaskit/navigation-next';
import PageHeader from '@atlaskit/page-header';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';

// Components
import { ProjectHomeView } from '..';

const Box = posed.div({
  draggable: 'x',
  dragBounds: { left: '-100%', right: '100%' },
  init: { scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
  drag: { scale: 1, boxShadow: '5px 5px 10px rgba(0,0,0,0.5)' },
});

function Portfolio({ navigationViewController }) {
  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);

  const [epics, setEpics] = useState(data);

  const onStart = (e) => {
    // const { offsetLeft } = e.target;
    // console.log(e);
  };

  const onEnd = (e) => {
    // console.log(e);
  };

  const onDrag = (e) => {
    // console.log(e);
  };

  const createEpic = () => {
    console.log('Create Epic');
    const { length } = epics;
    const num = length + 1;
    console.log(num);
    const epic = {
      id: `${num}`,
      key: `ST-${num}`,
      summary: `Epic Number ${num}`,
      startDate: 0,
      endDate: 100,
    };
    setEpics([...epics, epic]);
  };

  return (
    <div css={{ display: 'flex' }}>
      <PageHeader>Roadmap</PageHeader>
      <div css={{ width: '100px', padding: '0 5px' }}>
        <Button appearance="subtle" iconBefore={AddIcon()} onClick={createEpic} />
      </div>
      {epics.map(({ id }) => (
        <div key={id} style={{ padding: '5px' }}>
          <Box
            className="box"
            onDragStart={onStart}
            onDragEnd={onEnd}
            onValueChange={{ x: onDrag }}
          />
        </div>
      ))}
    </div>
  );
}

Portfolio.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Portfolio);
