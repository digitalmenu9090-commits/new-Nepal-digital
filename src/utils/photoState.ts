import { useState, useEffect } from 'react';
import defaultNaturalPhoto from '../assets/images/aadrash_natural_photo_1789106127179.jpg';

const STORAGE_KEY = 'aadrash_portfolio_natural_photo';

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
          // localStorage quota handling
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
