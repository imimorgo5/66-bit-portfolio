import { useRef } from 'react';

export function useFileInput(onFileSelected) {
  const inputRef = useRef(null);

  const trigger = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  const handleChange = e => {
    if (e.target.files) {
      onFileSelected(e.target.files);
    }
  };

  return { inputRef, trigger, handleChange };
}
