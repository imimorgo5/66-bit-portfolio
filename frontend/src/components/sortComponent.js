import React, { useState, useEffect } from 'react';
import '../css/sort.css';

export default function SortComponent({ onSortChange }) {
  const [selectedOption, setSelectedOption] = useState('date');

  const handleClick = (option) => {
    setSelectedOption(option);
    if (onSortChange) {
      onSortChange(option);
    }
  };

  useEffect(() => {
    if (onSortChange) {
      onSortChange(selectedOption);
    }
  }, [selectedOption, onSortChange]);

  return (
    <div className="sort-options">
      <h2>Сортировать:</h2>
      <div
        className={`sort-option ${selectedOption === 'date' ? 'active' : ''}`}
        onClick={() => handleClick('date')}
      >
        По времени добавления
      </div>
      <div
        className={`sort-option ${selectedOption === 'name' ? 'active' : ''}`}
        onClick={() => handleClick('name')}
      >
        По названию
      </div>
    </div>
  );
}
