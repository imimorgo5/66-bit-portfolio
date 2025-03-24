import React, { useState } from 'react';
import '../css/self-team-switch.css';

export default function SelfTeamSwitch({ onOptionChange }) {
  const [selectedOption, setSelectedOption] = useState('self');

  const handleClick = (option) => {
    setSelectedOption(option);
    
    if (onOptionChange) {
      onOptionChange(option);
    }
  };

  return (
    <div className="self-team-switch">
      <div
        className={`self-team-switch-option ${selectedOption === 'self' ? 'active' : ''}`}
        onClick={() => handleClick('self')}
      >
        Личные
      </div>
      <div
        className={`self-team-switch-option ${selectedOption === 'team' ? 'active' : ''}`}
        onClick={() => handleClick('team')}
      >
        Командные
      </div>
    </div>
  );
}
