// src/utils/imageUtils.js

export const handleImageError = (e, fallbackUrl = '/images/default-image.png') => {
  if (!e?.target?.src || e.target.src.trim() === '' || e.target.src.includes('undefined')) {
    e.target.src = fallbackUrl;
  } else {
    e.target.src = fallbackUrl;
  }
  e.target.onerror = null; // 무한 루프 방지
};
