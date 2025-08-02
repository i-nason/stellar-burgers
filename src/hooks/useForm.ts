import { useState, ChangeEvent } from 'react';

export function useForm<T extends Record<string, any>>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
}
