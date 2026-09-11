import { useState, useEffect } from 'react';
import defaultNaturalPhoto from '../assets/images/aadrash_natural_photo_1789106127179.jpg';

const STORAGE_KEY = 'aadrash_portfolio_user_natural_photo';

export function usePortfolioPhoto() {
  const [photo, setPhoto] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return defaultNaturalPhoto;
  });

  const uploadPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPhoto(result);
        try {
          localStorage.setItem(STORAGE_KEY, result);
        } catch {
          // If file is very large for localStorage, optimize it using canvas
          try {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1200;
              const scale = Math.min(1, MAX_WIDTH / img.width);
              canvas.width = img.width * scale;
              canvas.height = img.height * scale;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const compressed = canvas.toDataURL('image/jpeg', 0.92);
                try {
                  localStorage.setItem(STORAGE_KEY, compressed);
                } catch {
                  // ignore
                }
              }
            };
            img.src = result;
          } catch {
            // ignore
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const resetPhoto = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setPhoto(defaultNaturalPhoto);
  };

  return {
    photo,
    uploadPhoto,
    resetPhoto,
    isCustom: photo !== defaultNaturalPhoto,
    defaultPhoto: defaultNaturalPhoto
  };
}

