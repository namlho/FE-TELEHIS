export const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = (e) => reject(e);
  reader.onload = () => {
    const result = reader.result || '';
    const idx = result.indexOf(',');
    const base64 = idx >= 0 ? result.slice(idx + 1) : result;
    resolve(base64);
  };
  reader.readAsDataURL(file);
});

export const inferMimeFromBase64 = (base64, fallback) => {
  if (!base64) return fallback || 'application/octet-stream';
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('iVBOR')) return 'image/png';
  if (base64.startsWith('R0lGOD')) return 'image/gif';
  if (base64.startsWith('UklGR')) return 'image/webp';
  if (base64.startsWith('Qk')) return 'image/bmp';
  return fallback || 'application/octet-stream';
};

export const extFromMime = (mime) => {
  if (!mime) return '';
  if (mime.includes('jpeg') || mime.includes('jpg')) return '.jpg';
  if (mime.includes('png')) return '.png';
  if (mime.includes('gif')) return '.gif';
  if (mime.includes('webp')) return '.webp';
  if (mime.includes('bmp')) return '.bmp';
  return '';
};

export const sanitizeFilename = (name, mime, base64) => {
  if (!name) name = 'file';
  const lastDot = name.lastIndexOf('.');
  let base = name;
  let ext = '';
  if (lastDot > 0) {
    base = name.slice(0, lastDot);
    ext = name.slice(lastDot);
  }
  base = base.replace(/[^a-zA-Z0-9-_ ]/g, '_').trim();
  if (base.length > 80) base = base.slice(0, 80);
  if (!ext) {
    const inferredMime = inferMimeFromBase64(base64, mime);
    ext = extFromMime(inferredMime) || '';
  }
  return `${base}${ext}`;
};
