import { useState, useEffect } from 'react';
import { PORTFOLIO_INFO } from '../data/portfolioData';

const STORAGE_KEY = 'aadrash_portfolio_custom_photo';

export function usePortfolioPhoto() {
  const [photo, setPhoto] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return PORTFOLIO_INFO.images.heroPortrait;
  });

  const [isCustom, setIsCustom] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setPhoto(saved);
          setIsCustom(true);
        } else {
          setPhoto(PORTFOLIO_INFO.images.heroPortrait);
          setIsCustom(false);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('portfolio-photo-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('portfolio-photo-updated', handleStorage);
    };
  }, []);

  const choosePhotoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Optimize for localStorage using an offscreen canvas if it's large
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_DIM = 1600;
            let { width, height } = img;
            if (width > MAX_DIM || height > MAX_DIM) {
              if (width > height) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              } else {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
              setPhoto(dataUrl);
              setIsCustom(true);
              localStorage.setItem(STORAGE_KEY, dataUrl);
              window.dispatchEvent(new Event('portfolio-photo-updated'));
              return;
            }
          } catch {
            // fallback to raw result
          }
          setPhoto(result);
          setIsCustom(true);
          try {
            localStorage.setItem(STORAGE_KEY, result);
            window.dispatchEvent(new Event('portfolio-photo-updated'));
          } catch {
            // ignore quota errors
          }
        };
        img.src = result;
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
    setPhoto(PORTFOLIO_INFO.images.heroPortrait);
    setIsCustom(false);
    window.dispatchEvent(new Event('portfolio-photo-updated'));
  };

  return {
    photo,
    choosePhotoFile,
    resetPhoto,
    isCustom,
    defaultPhoto: PORTFOLIO_INFO.images.heroPortrait
  };
}
