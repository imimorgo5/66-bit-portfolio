export async function fetchAsFile(fileTitle) {
  const response = await fetch(getFullName(fileTitle), { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки файла ${fileTitle}: ${response.status} ${response.statusText}`);
  }

  const blob = await response.blob();
  return new File([blob], fileTitle, { type: blob.type });
}

export const getFullName = (fileName) => `http://localhost:8080/uploads/${fileName}`;
