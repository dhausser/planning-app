import React from 'react';
import {
  ApolloClient,
  DocumentNode,
  useApolloClient,
  useQuery,
  gql,
} from '@apollo/client';
import Select, { OptionType, OptionsType, ValueType } from '@atlaskit/select';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import EmptyState from '@atlaskit/empty-state';

interface FilterOption {
  id: number;
  name: string;
}

interface FilterOptionData {
  items: FilterOption[];
}

interface FilterParams {
  optionName: string,
  setValue: string,
  resetValue: string,
}

interface FilterProps {
  query: DocumentNode,
  params: FilterParams,
  isClearable: boolean,
}

interface ItemProps {
  id: string,
  name: string,
}

interface IIndexable {
  [key: string]: any;
}

interface CacheProps {
  client: ApolloClient<object>
  value: string | number | null,
  setValue: string,
  resetValue: string,
}

export const updateCache = ({ client, value, setValue, resetValue }: CacheProps) => {
  const query = gql`{
    ${setValue}
    ${resetValue}
  }`;
  const data = {
    [setValue]: value,
    [resetValue]: null,
  };
  client.writeQuery({ query, data });
};

export const updateLocalStorage = (itemId: string, value: string | number | null) => {
  if (value) {
    localStorage.setItem(itemId, value as string);
  } else {
    localStorage.removeItem(itemId);
  }
};

function Filter({ query, params, isClearable }: FilterProps) {
  const client = useApolloClient();
  const { loading, error, data } = useQuery<FilterOptionData>(query);
  const { optionName, setValue, resetValue } = params;

  let selected: OptionType | null = null;
  let options: OptionsType<OptionType> = [];

  const updateFilter = (e: OptionType | null) => {
    const value = e ? e.value : null;
    updateCache({ client, value, setValue, resetValue });
    updateLocalStorage(setValue, value);
  };

  const handleChange = (e: ValueType<OptionType>) => {
    if ((Array.isArray(e))) {
      throw new Error('Unexpected type passed to ReactSelect onChange handler');
    }
    updateFilter(e as OptionType);
  };

  if (error) return <EmptyState header={error.name} description={error.message} />;

  if (data && (data as IIndexable)[optionName]) {
    options = (data as IIndexable)[optionName].map(({ id, name }: ItemProps) => {
      const option = { value: id, label: (name || id) };
      if (id === (data as IIndexable)[setValue]) selected = option;
      return option;
    });
  }

  return (
    <Wrapper>
      <Select
        spacing="compact"
        isClearable={isClearable}
        value={selected}
        isLoading={loading}
        options={options}
        onChange={handleChange}
        placeholder={`Select ${setValue}`}
      />
    </Wrapper>
  );
}

Filter.defaultProps = {
  isClearable: false,
};

Filter.propTypes = {
  query: PropTypes.exact({
    kind: PropTypes.string,
    definitions: PropTypes.arrayOf(PropTypes.object),
    loc: PropTypes.object,
  }).isRequired,
  params: PropTypes.exact({
    optionName: PropTypes.string,
    setValue: PropTypes.string,
    resetValue: PropTypes.string,
  }).isRequired,
  isClearable: PropTypes.bool,
};

export default Filter;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

export const Wrapper = styled.div`
  flex-basis: 180px;
  margin-right: 10px;
 `;
