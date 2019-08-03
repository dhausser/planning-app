import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import gql from 'graphql-tag';
import { withNavigationViewController } from '@atlaskit/navigation-next';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import PageHeader from '@atlaskit/page-header';
import Button from '@atlaskit/button';
import EmptyState from '@atlaskit/empty-state';
import AddIcon from '@atlaskit/icon/glyph/add';
import { ProjectHomeView, Loading } from '..';
import Epic16Icon from '@atlaskit/icon-object/glyph/epic/16';
import styled from 'styled-components';
import { ProjectFilter, VersionFilter } from '../Filters';
import './styles.css';

const RoadmapPanel = styled.div`
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

const Box = posed.div({
  draggable: 'x',
  dragBounds: { left: '-100%', right: '100%' },
  init: { scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)' },
  drag: { scale: 1, boxShadow: '5px 5px 10px rgba(0,0,0,0.5)' },
});

const GET_ISSUES = gql`
  query issueList($projectId: String, $versionId: String) {
    filter @client {
      project {
        id @export(as: "projectId")
      }
      version {
        id @export(as: "versionId")
      }
    }
    epics(projectId: $projectId, versionId: $versionId) {
      id
      key
      fields {
        summary
      }
    }
  }
`;

const barContent = (
  <div style={{ display: 'flex' }}>
    <ProjectFilter />
    <VersionFilter />
  </div>
);

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => { }}>
    <BreadcrumbsItem text="Projects" key="Projects" />
    <BreadcrumbsItem text="Gwent" key="Gwent" />
  </BreadcrumbsStateless>
);

const onStart = (e) => {
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
  // const { length } = epics;
  // const num = length + 1;
  // console.log(num);
  // const epic = {
  //   id: `${num}`,
  //   key: `ST-${num}`,
  //   summary: `Epic Number ${num}`,
  //   startDate: 0,
  //   endDate: 100,
  // };
  // setEpics([...epics, epic]);
};

function Portfolio({ navigationViewController }) {
  // const [epics, setEpics] = useState(data);
  const { data, loading, error } = useQuery(GET_ISSUES);

  useEffect(() => {
    navigationViewController.setView(ProjectHomeView.id);
  }, [navigationViewController]);


  if (loading) return <Loading />;
  if (error) return <EmptyState header={error.name} description={error.message} />;

  const { epics } = data;

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} bottomBar={barContent}>Roadmap</PageHeader>
      <div style={{ display: 'flex' }}>
        <div style={{ position: 'relative', margin: 'top: 24px', flex: '1 1 auto' }}>
          <RoadmapPanel>
            <LeftColumn>
              <LeftColumnHeader>
                Epic
              </LeftColumnHeader>
              {epics.map(epic => (
                <div key={epic.id} style={{ padding: '5px' }}>
                  <span>
                    <p>
                      <Epic16Icon />
                      {epic.fields.summary}
                    </p>
                  </span>
                  <Box
                    className="box"
                    onDragStart={onStart}
                    onDragEnd={onEnd}
                    onValueChange={{ x: onDrag }}
                  />
                </div>
              ))}
              <LeftColumnContentBottom>
                <Button appearance="subtle" iconBefore={AddIcon()} onClick={createEpic} />
              </LeftColumnContentBottom>

            </LeftColumn>
            <RightPanel />
          </RoadmapPanel>
        </div>
      </div>
    </>
  );
}

Portfolio.propTypes = {
  navigationViewController: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default withNavigationViewController(Portfolio);
