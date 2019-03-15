import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import ContentWrapper from './ContentWrapper';
import PageTitle from './PageTitle';

export default class Settings extends Component {
  static contextTypes = {
    themeMode: PropTypes.string,
    switchTheme: PropTypes.func,
  };

  render() {
    return (
      <ContentWrapper>
        <PageTitle>Settings</PageTitle>
        <AtlaskitThemeProvider mode={this.context.themeMode}>
          <div style={{ padding: 8 }}>
            <Button onClick={this.context.switchTheme}>Switch theme ({this.context.themeMode})</Button>
          </div>
        </AtlaskitThemeProvider>
      </ContentWrapper>
    );
  }
}