import React, { useState } from 'react';
import FilePreviewModal from './file-preview.js';
import { getFullName, getFileType } from '../utils/file.js';
import { FileType } from '../consts.js';
import imageIcon from '../img/picture-icon.svg';
import videoIcon from '../img/video-icon.svg';
import audioIcon from '../img/audio-icon.svg';
import textIcon from '../img/text-icon.svg';
import systemIcon from '../img/system-icon.svg';
import '../css/file-list-component.css';

export default function FileList({ editable = false, title, files, maxTitleLength, maxCount, onRemove, onDescriptionChange, onAddClick, fileInputProps, className = '' }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const getfileImageName = (file) => {
    const fileType = getFileType(file);
    if (fileType === FileType.IMAGE) return imageIcon;
    if (fileType === FileType.VIDEO) return videoIcon;
    if (fileType === FileType.AUDIO) return audioIcon;
    if (fileType === FileType.DOCUMENT) return textIcon;
    return systemIcon;
  }

  const onFileClick = (f) => {
    if (!f) {
      return null;
    }
    let fileData = null;

    if (f.file instanceof File) {
      fileData = {
        fileTitle: f.fileTitle || f.file.name,
        fileViewName: f.description ? f.description : f.fileTitle.slice(14, 14 + maxTitleLength),
        url: null,
        file: f.file
      };
    } else {
      fileData = {
        fileTitle: f.fileTitle,
        fileViewName: f.description ? f.description : f.fileTitle.slice(14, 14 + maxTitleLength),
        url: getFullName(f.fileTitle),
        file: null
      };
    }

    if (fileData) {
      setPreviewFile(fileData);
      setIsPreviewOpen(true);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  };

  return (
    <div className={`file-section ${className} ${editable ? 'edit' : ''}`}>
      {title && <h3>{title}</h3>}
      {files && files.length > 0 ? (
        <ul className="file-list">
          {files.map((f, i) => (
            <li key={i} className="file-item">
              {editable && <button type="button" onClick={() => onRemove(i)} className="remove-button">×</button>}
              <div className="file-item-container">
                {!editable && <img src={getfileImageName(f)} className='file-icon' alt='Иконка файла'></img>}
                <h4 className={`${editable ? '' : 'link'} file-title`} onClick={editable ? null : () => onFileClick(f)}>
                  {(f.description && !editable) ? f.description : f.file ? f.fileTitle.slice(0, maxTitleLength) : f.fileTitle.slice(14, 14 + maxTitleLength)}
                </h4>
                {editable &&
                  <input
                    type="text"
                    value={f.description}
                    maxLength={30}
                    onChange={e => onDescriptionChange(i, e.target.value)}
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
      <FilePreviewModal file={previewFile} isOpen={isPreviewOpen} onClose={closePreview} />
    </div>
  );
}
