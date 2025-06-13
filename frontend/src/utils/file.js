import { FileType } from "../consts.js";

export async function fetchAsFile(fileTitle) {
  const response = await fetch(getFullName(fileTitle), { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки файла ${fileTitle}: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  return new File([blob], fileTitle, { type: blob.type });
}

export const getFullName = (fileName) => `http://localhost:8080/uploads/${fileName}`;

const getExt = (file) => {
  if (!file || !file.fileTitle) return '';
  const parts = file.fileTitle.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const isImage = (ext) => ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext);

const isVideo = (ext) => ['mp4', 'webm', 'ogg'].includes(ext);

const isAudio = (ext) => ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext);

const isDoc = (ext) => ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'].includes(ext);

export const getFileType = (file) => {
  const ext = getExt(file);
  if (isImage(ext)) return FileType.IMAGE;
  if (isVideo(ext)) return FileType.VIDEO;
  if (isAudio(ext)) return FileType.AUDIO;
  if (isDoc(ext)) return FileType.DOCUMENT;
  return FileType.ANOTHER;
}
