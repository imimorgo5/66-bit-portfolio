import React, { useState } from 'react';
import '../css/sort.css';

export default function SortOptions({ onSortChange }) {
  const [selectedOption, setSelectedOption] = useState('date');

  const handleClick = (option) => {
    setSelectedOption(option);
    if (onSortChange) {
      onSortChange(option);
    }
  };

  return (
    <div className="sort-options">
      <h2>Сортировка:</h2>
      <div
        className={`sort-option ${selectedOption === 'date' ? 'active' : ''}`}
        onClick={() => handleClick('date')}
      >
        По дате создания
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
