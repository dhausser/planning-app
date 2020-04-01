import { useState, SyntheticEvent } from 'react';

export default function useForm(initial = {}): object {
  const [inputs, setInputs] = useState(initial);

  function handleChange(e: SyntheticEvent): void {
    const target = e.target as typeof e.target & {
      name: string;
      type: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any;
      files: string[];
    };

    const { name, type } = target;
    let { value } = target;

    if (type === 'number') {
      value = parseInt(value, 10);
    }
    if (type === 'file') {
      [value] = target.files;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm(): void {
    setInputs(initial);
  }

  function clearForm(): void {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key]) => [key, ''])
    );
    setInputs(blankState);
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
