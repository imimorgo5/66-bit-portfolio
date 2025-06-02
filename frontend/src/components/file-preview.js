import React, { useMemo, useEffect } from 'react';
import '../css/file-preview.css';

export default function FilePreviewModal({ file, isOpen, onClose }) {
    const fileUrl = useMemo(() => {
        if (!file) return null;
        if (file.url) {
            return file.url;
        } else if (file.file instanceof File) {
            return URL.createObjectURL(file.file);
        } else {
            return null;
        }
    }, [file]);

    useEffect(() => {
        if (file && file.file instanceof File && fileUrl) {
            return () => {
                URL.revokeObjectURL(fileUrl);
            };
        }
    }, [file, fileUrl]);

    const isImage = useMemo(() => {
        if (!fileUrl) return false;
        const ext = file.fileName ? file.fileName.split('.').pop().toLowerCase() : '';
        return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext);
    }, [file, fileUrl]);

    const viewerUrl = useMemo(() => {
        if (!fileUrl || isImage) return null;
        return `https://docs.google.com/gview?url=${fileUrl}&embedded=true`;
    }, [fileUrl, isImage]);

    if (!isOpen || !file) {
        return null;
    }

    return (
        <div className="preview-file-overlay">
            <div className="preview-file-container">
                <div className="preview-file-header">
                    <h3 className="preview-file-title">{file.fileViewName}</h3>
                    <button className="remove-button" onClick={onClose}>×</button>
                </div>
                <div className="preview-file-content">
                    {isImage ? (
                        <img src={fileUrl} alt={file.fileName} className="preview-file-image" />
                    ) : (
                        <iframe
                            src={viewerUrl}
                            className="preview-file-iframe"
                            title={file.fileName}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
