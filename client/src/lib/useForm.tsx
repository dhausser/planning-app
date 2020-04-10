/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, SyntheticEvent } from 'react';
import { OptionsType } from '@atlaskit/select';

interface Target {
  name: string;
  type: string;
  value: string | OptionsType<{ value: string; label: string }>;
}

interface Inputs {
  firstname: string;
  lastname: string;
  email: string;
  team: string;
}

interface UseForm {
  inputs: Inputs;
  handleChange: (e: SyntheticEvent | any) => void;
  // handleChange: (e: SyntheticEvent | ValueType<SyntheticEvent>) => void;
  resetForm: () => void;
  clearForm: () => void;
}

const blankState = {
  firstname: '',
  lastname: '',
  email: '',
  team: '',
};

export default function useForm(initial = blankState): UseForm {
  const [inputs, setInputs] = useState(initial);

  function handleChange(e: SyntheticEvent): void {
    // const target = e.target as typeof e.target & Target;

    // const { name, type, value } = target;

    // console.log({ name, type, value });
    console.log(e);

    // setInputs({
    //   ...inputs,
    //   [name]: value,
    // });
  }

  function resetForm(): void {
    setInputs(initial);
  }

  function clearForm(): void {
    // const blankState = Object.fromEntries(
    //   Object.entries(inputs).map(([key]) => [key, ''])
    // );
    setInputs(blankState);
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
