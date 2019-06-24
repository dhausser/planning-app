/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import EmptyState from '@atlaskit/empty-state';
import Button from '@atlaskit/button';

function Error({ error }) {
  const primaryAction = (
    <Button
      appearance="primary"
      onClick={() => console.log('primary action clicked')}
    >
      Primary action
    </Button>
  );

  const secondaryAction = (
    <Button onClick={() => console.log('secondary action clicked')}>
      Secondary action
    </Button>
  );

  const tertiaryAction = (
    <Button
      appearance="subtle-link"
      href="http://www.example.com"
      target="_blank"
    >
      Tertiary action
    </Button>
  );

  const props = {
    header: 'Error',
    description: error.message,
    primaryAction,
    secondaryAction,
    tertiaryAction,
  };

  return <EmptyState {...props} />;
}

Error.propTypes = {
  error: PropTypes.objectOf(PropTypes.arrayOf).isRequired,
};

export default Error;
