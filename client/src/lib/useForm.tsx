import { useState, SyntheticEvent } from 'react';

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);

  function handleChange(e: SyntheticEvent) {
    const target = e.target as typeof e.target & {
      name: string;
      type: string;
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

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key]) => [key, '']),
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
