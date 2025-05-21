import React from 'react';
import '../css/self-team-switch.css';

export default function SelfTeamSwitch({ isTeamMode, onOptionChange }) {

  return (
    <div className="self-team-switch">
      <div
        className={`self-team-switch-option ${!isTeamMode ? 'active' : ''}`}
        onClick={() => onOptionChange('self')}
      >
        Личные
      </div>
      <div
        className={`self-team-switch-option ${isTeamMode ? 'active' : ''}`}
        onClick={() => onOptionChange('team')}
      >
        Командные
      </div>
    </div>
  );
}
