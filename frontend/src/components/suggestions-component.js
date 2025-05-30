import React from 'react';
import '../css/suggestions-component.css';

export default function Suggestions({searchRef, searchTerm, onChange, isDisabled, placeholder, suggestions, getAlready, addItem, getSuggestionTitle, getAlreadyTitle, className = '' }) {
  return (
    <div className={`suggestions-container ${className}`} ref={searchRef}>
      <input
        type="text"
        value={searchTerm}
        className='text-input suggestions-input'
        onChange={onChange}
        disabled={isDisabled}
        placeholder={placeholder}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map(s => {
            const already = getAlready(s);
            return (
              <li key={s.id} onClick={() => !already && addItem(s)} className={already ? 'already-added' : ''}>
                <h4>{getSuggestionTitle(s)}</h4>
                {already && <span className="tag">{getAlreadyTitle(s)}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}