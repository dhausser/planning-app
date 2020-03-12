import React from 'react';
import {
  ApolloClient,
  useApolloClient,
  useQuery,
  DocumentNode,
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

interface FilterProps {
  query: DocumentNode,
  itemName: string,
  itemValues: Array<string>,
  isClearable: boolean,
}

interface ItemProps {
  id: string,
  name: string,
}

interface IIndexable {
  [key: string]: any;
}

function gqlFromArray(items: Array<string>) {
  const string = items.join(' ');
  return gql`{ ${string} }`;
}

export const updateCache = (
  client: ApolloClient<object>,
  value: string | number | null,
  itemValues: Array<string>,
) => {
  const query = gqlFromArray(itemValues);
  const data = itemValues.reduce((accumulator: object, currentValue: string, i: number) => {
    if (i === 0) {
      accumulator[currentValue] = value;
    } else {
      accumulator[currentValue] = null;
    }
    return accumulator;
  }, {});
  client.writeQuery({ query, data });
};

export const updateLocalStorage = (itemId: string, value: string | number | null) => {
  if (value) {
    localStorage.setItem(itemId, value as string);
  } else {
    localStorage.removeItem(itemId);
  }
};

function Filter({ query, itemName, itemValues, isClearable }: FilterProps) {
  const client = useApolloClient();
  const { loading, error, data } = useQuery<FilterOptionData>(query);
  let selected: OptionType | null = null;
  let options: OptionsType<OptionType> = [];

  const [itemId] = itemValues;

  const updateFilter = (e: OptionType | null) => {
    const value = e ? e.value : null;
    updateCache(client, value, itemValues);
    updateLocalStorage(itemId, value);
  };

  const handleChange = (e: ValueType<OptionType>) => {
    if ((Array.isArray(e))) {
      throw new Error('Unexpected type passed to ReactSelect onChange handler');
    }
    updateFilter(e as OptionType);
  };

  if (error) return <EmptyState header={error.name} description={error.message} />;

  if (data && (data as IIndexable)[itemName]) {
    options = (data as IIndexable)[itemName].map(({ id, name }: ItemProps) => {
      const option = { value: id, label: (name || id) };
      if (id === (data as IIndexable)[itemId]) selected = option;
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
        placeholder={itemId}
      />
    </Wrapper>
  );
}

Filter.propTypes = {
  query: PropTypes.exact({
    kind: PropTypes.string,
    definitions: PropTypes.arrayOf(PropTypes.object),
    loc: PropTypes.object,
  }).isRequired,
  itemName: PropTypes.string.isRequired,
  itemValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  isClearable: PropTypes.bool.isRequired,
};

export default Filter;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

export const Wrapper = styled.div`
  flex-basis: 180px;
  margin-right: 10px;
 `;
