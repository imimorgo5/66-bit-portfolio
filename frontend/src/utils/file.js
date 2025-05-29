export async function fetchAsFile(fileTitle) {
  const response = await fetch(getFullName(fileTitle), { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки файла ${fileTitle}: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  return new File([blob], fileTitle, { type: blob.type });
}

export const handleFileClick = async (file) => {
  try {
    const resp = await fetch(getFullName(file.fileTitle), { credentials: 'include' });
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.fileTitle;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Ошибка при скачивании файла:', err);
  }
};

export const getFullName = (fileName) => `http://localhost:8080/uploads/${fileName}`;
