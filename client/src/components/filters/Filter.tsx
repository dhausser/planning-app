import React from 'react';
import {
  ApolloClient,
  DocumentNode,
  useApolloClient,
  useQuery,
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
  query: DocumentNode;
  updateFilter: (client: ApolloClient<object>, e: OptionType) => void;
  isClearable: boolean;
  valuesName: string;
  valueName: string;
  placeholder: string;
}

interface ItemProps {
  id: string;
  name: string;
}

interface IIndexable {
  [key: string]: any;
}

function Filter({
  query,
  updateFilter,
  valuesName,
  valueName,
  placeholder,
  isClearable,
}: FilterProps) {
  const client = useApolloClient();
  const { loading, error, data } = useQuery<FilterOptionData>(query);

  let selected: OptionType | null = null;
  let options: OptionsType<OptionType> = [];

  const handleChange = (e: ValueType<OptionType>) => {
    if (Array.isArray(e)) {
      throw new Error('Unexpected type passed to ReactSelect onChange handler');
    }
    updateFilter(client, e as OptionType);
  };

  if (error) {
    return <EmptyState header={error.name} description={error.message} />;
  }

  if (data && (data as IIndexable)[valuesName]) {
    options = (data as IIndexable)[valuesName].map(
      ({ id, name }: ItemProps) => {
        const option = { value: id, label: name || id };
        if (id === (data as IIndexable)[valueName]) selected = option;
        return option;
      },
    );
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
        placeholder={placeholder}
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
  valueName: PropTypes.string.isRequired,
  valuesName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  updateFilter: PropTypes.func.isRequired,
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
