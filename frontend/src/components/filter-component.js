import React from 'react';
import '../css/items-view-options.css';

export default function FilterComponent({ isTeamMode, onOptionChange }) {

  return (
    <div className="items-view-options">
      <div
        className={`items-view-option ${!isTeamMode ? 'active' : ''}`}
        onClick={() => onOptionChange('self')}
      >
        Личные
      </div>
      <div
        className={`items-view-option ${isTeamMode ? 'active' : ''}`}
        onClick={() => onOptionChange('team')}
      >
        Командные
      </div>
    </div>
  );
}
