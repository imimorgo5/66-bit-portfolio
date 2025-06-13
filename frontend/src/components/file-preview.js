import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { getFileType } from '../utils/file.js';
import { FileType } from '../consts.js';
import '../css/file-preview.css';

export default function FilePreviewModal({ file, isOpen, onClose }) {
    const [isIframeLoading, setIsIframeLoading] = useState(false);

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

    const fileType = useMemo(() => getFileType(file), [file])

    const isImageFile = useMemo(() => fileType === FileType.IMAGE, [fileType]);

    const isVideoFile = useMemo(() => fileType === FileType.VIDEO, [fileType]);

    const isAudioFile = useMemo(() => fileType === FileType.AUDIO, [fileType]);

    const isDocFile = useMemo(() => fileType === FileType.DOCUMENT, [fileType]);

    const viewerUrl = useMemo(() => {
        if (!fileUrl || !isDocFile) return null;
        return `https://docs.google.com/gview?url=${fileUrl}&embedded=true`;
    }, [fileUrl, isDocFile]);

    useEffect(() => {
        if (viewerUrl) {
            setIsIframeLoading(true);
        }
    }, [viewerUrl]);

    const handleDownload = useCallback(async (e) => {
        e.preventDefault();

        if (file.file instanceof File && fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = file.fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();

        } else if (file.url) {
            try {
                const response = await fetch(file.url);
                if (!response.ok) {
                    throw new Error(`Ошибка при скачивании: ${response.statusText}`);
                }
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = file.fileName;
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(blobUrl);
            } catch (err) {
                console.error('Не удалось скачать файл напрямую. Открываем в новой вкладке:', err);
                window.open(file.url, '_blank');
            }
        }
    }, [file, fileUrl]);

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
                    {isImageFile && fileUrl && (<img src={fileUrl} alt={file.fileName} className="preview-file-image" />)}
                    {!isImageFile && isVideoFile && fileUrl && (<video src={fileUrl} controls className="preview-file-video" />)}
                    {!isImageFile && !isVideoFile && isAudioFile && fileUrl && (<audio src={fileUrl} controls className="preview-file-audio" />)}
                    {!isImageFile && !isVideoFile && !isAudioFile && isDocFile && viewerUrl && (
                        <div className="iframe-wrapper">
                            {isIframeLoading && (
                                <div className="iframe-loader">
                                    <h1>Загрузка...</h1>
                                </div>
                            )}
                            <iframe
                                src={viewerUrl}
                                className="preview-file-iframe"
                                title={file.fileName}
                                onLoad={() => setIsIframeLoading(false)}
                            />
                        </div>
                    )}
                    {!isImageFile && !isVideoFile && !isDocFile && !isAudioFile && fileUrl && (
                        <div className="download-wrapper">
                            <h1>Предпросмотр файлов такого типа не поддерживается</h1>
                            <button className="link download-link" onClick={handleDownload}>Скачать файл</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
