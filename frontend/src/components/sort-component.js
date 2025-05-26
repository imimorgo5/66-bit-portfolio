import React, { useState, useEffect } from 'react';
import '../css/items-view-options.css';

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
    <div className="items-view-options">
      <div
        className={`items-view-option ${selectedOption === 'date' ? 'active' : ''}`}
        onClick={() => handleClick('date')}
      >
        По времени добавления
      </div>
      <div
        className={`items-view-option ${selectedOption === 'name' ? 'active' : ''}`}
        onClick={() => handleClick('name')}
      >
        По названию
      </div>
    </div>
  );
}
