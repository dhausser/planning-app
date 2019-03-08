import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import MainSection from '../components/atlaskit/MainSection';
import ContentWrapper from '../components/atlaskit/ContentWrapper';
import PageTitle from '../components/atlaskit/PageTitle';

export default class HomePage extends Component {
  static contextTypes = {
    showModal: PropTypes.func,
    addFlag: PropTypes.func,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
  };

  render() {
    return (
      <ContentWrapper>
        <PageTitle>Dashboard</PageTitle>
        <MainSection resources={this.props.resources}/>
        <ButtonGroup>
          <Button
            appearance="primary"
            onClick={this.context.showModal}s
            onClose={() => { }}
          >Click to view Atlaskit modal</Button>
          <Button onClick={this.context.addFlag}>click to view Atlaskit flag</Button>
        </ButtonGroup>
      </ContentWrapper>
    );
  }
}
