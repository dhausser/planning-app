import * as React from 'react';
import { ApolloClient, useApolloClient, useQuery, DocumentNode } from '@apollo/client';
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

type FilterProps = {
  query: DocumentNode,
  items: string,
  itemId: string,
  isClearable: boolean,
  updateCache: (client: ApolloClient<object>, value: string | null) => void,
}

type ItemProps = {
  id: string,
  name: string,
}

export interface IIndexable {
  [key: string]: any;
}

export interface Selection {
  value: string;
  label: string;
}

function Filter({ query, items, itemId, isClearable, updateCache }: FilterProps) {
  const client = useApolloClient();
  const { loading, error, data } = useQuery<FilterOptionData>(query);
  let value: OptionType | null = null;
  let options: OptionsType<OptionType> = [];

  const handleChange = (e: ValueType<OptionType>) => {
    console.log(e);
    updateCache(client, null);
    if (value) {
      localStorage.setItem(itemId, '');
    } else {
      localStorage.removeItem(itemId);
    }
  };

  if (error) return <EmptyState header={error.name} description={error.message} />;

  if (data && (data as IIndexable)[items]) {
    options = (data as IIndexable)[items].map(({ id, name }: ItemProps) => {
      const option = { value: id, label: (name || id) };
      if (id === (data as IIndexable)[itemId]) value = option;
      return option;
    });
  }

  return (
    <Wrapper>
      <Select
        spacing="compact"
        isClearable={isClearable}
        value={value}
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
  items: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  isClearable: PropTypes.bool.isRequired,
  updateCache: PropTypes.func.isRequired,
};

export default Filter;

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

export const Wrapper = styled.div`
  flex-basis: 180px;
  margin-right: 10px;
 `;
