import React, { ReactElement } from 'react';
import Select from '@atlaskit/select';
import { OptionsType } from '@atlaskit/select/types';

import useTeams from '../../lib/useTeams';
import { Team } from './types';

export default function TeamPicker(): ReactElement {
  const teams = useTeams();
  const options = teams.map(({ id }: Team) => ({ label: id, value: id }));

  // console.log({ teams, options });

  // you control how the options are filtered
  // const filter = (inputValue: string) =>
  //   options.filter((i) =>
  //     i.label.toLowerCase().includes(inputValue.toLowerCase())
  //   );

  // async load function using callback (promises also supported)
  // const loadOptions = (
  //   inputValue: string,
  //   callback: (options: OptionsType) => void
  // ): void => {
  //   const teams = useTeams();
  //   const options = teams.map(({ id }: Team) => ({ label: id, value: id }));
  //   return options;
  // };

  return (
    <Select
      className="async-select-with-callback"
      classNamePrefix="react-select"
      // loadOptions={loadOptions}
      options={options}
      placeholder="Choose a Team"
    />
  );
}
