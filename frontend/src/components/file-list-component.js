import React from 'react';
import { handleFileClick } from '../utils/file.js';
import fileIcon from '../img/file_icon.svg';
import '../css/file-list-component.css';

export default function FileList({editable = false, folderIndex = null, files, maxTitleLength, maxCount, onRemove, onDescriptionChange, onAddClick, fileInputProps, className = ''}) {
  return (
    <div className={`file-section ${className} ${editable ? 'edit' : ''}`}>
      {folderIndex == null && <h3>Файлы:</h3>}
      {files && files.length > 0 ? (
        <ul className="file-list">
          {files.map((f, i) => (
            <li key={i} className="file-item" onClick={editable ? null : () => handleFileClick(f)}>
              {editable && <button type="button" onClick={() => onRemove(folderIndex, i)} className="remove-button">×</button>}
              <div className="file-item-container">
                {!editable && <img src={fileIcon} className='file-icon' alt='Иконка файла'></img>}
                <h4 className={`${editable ? '' : 'link'} file-title`}>{(f.description && !editable) ? f.description : f.file ? f.fileTitle.slice(0, maxTitleLength) : f.fileTitle.slice(14, 14 + maxTitleLength)}</h4>
                {editable &&
                  <input
                    type="text"
                    value={f.description}
                    maxLength={maxCount}
                    onChange={e => onDescriptionChange(folderIndex, i, e.target.value)}
                    placeholder="Описание файла"
                    className="text-input file-description-input"
                  />
                }
              </div>
            </li>
          ))}
        </ul>
      ) : (<p className="empty-list">Файлы не добавлены</p>)}
      {editable &&
        <>
          <button type="button" onClick={onAddClick} disabled={files.length >= maxCount} className="button add-submit-button file-upload-button">Добавить файлы</button>
          <input
            {...fileInputProps}
            style={{ display: 'none' }}
            disabled={files.length >= maxCount}
          />
        </>
      }
    </div>
  );
}
