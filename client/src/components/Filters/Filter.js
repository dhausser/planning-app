import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import Select from '@atlaskit/select';
import EmptyState from '@atlaskit/empty-state';

function Filter({ query, handleChange, items, itemId }) {
  const { loading, error, data } = useQuery(query);
  let value = { value: '', label: '' };
  let options = [value];

  if (error) return <EmptyState header={error.name} description={error.message} />;
  if (data && data[items]) {
    options = data[items].map(({ id, name }) => {
      const option = { value: id, label: name };
      if (id === data[itemId]) value = option;
      return option;
    });
  }

  return (
    <Wrapper>
      <Select
        className="single-select"
        classNamePrefix="react-select"
        spacing="compact"
        value={value}
        isLoading={loading}
        options={options}
        placeholder="Choose a Project"
        onChange={handleChange}
      />
    </Wrapper>
  );
}

Filter.defaultProps = {
  items: [],
  itemId: '',
};

Filter.propTypes = {
  handleChange: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(),
  itemId: PropTypes.string,
};

export default Filter;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

export const Wrapper = styled.div`
flex-basis: 180px;
margin-right: 10px;
 `;
