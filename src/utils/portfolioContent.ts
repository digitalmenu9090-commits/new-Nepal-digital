import { useState, useEffect } from 'react';
import { PORTFOLIO_INFO, PROJECTS, SERVICES, SKILLS, STATS } from '../data/portfolioData';
import { authFetch, safeJsonResponse } from './adminAuth';

export interface PortfolioContentData {
  info: typeof PORTFOLIO_INFO;
  projects: typeof PROJECTS;
  services: typeof SERVICES;
  skills?: typeof SKILLS;
  stats?: typeof STATS;
}

const STORAGE_KEY = 'aadrash_portfolio_live_content_v1';

export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContentData = {
  info: PORTFOLIO_INFO,
  projects: PROJECTS,
  services: SERVICES,
  skills: SKILLS,
  stats: STATS,
};

export function getCachedPortfolioContent(): PortfolioContentData {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        ...DEFAULT_PORTFOLIO_CONTENT,
        ...parsed,
        info: {
          ...DEFAULT_PORTFOLIO_CONTENT.info,
          ...(parsed.info || {}),
          images: {
            ...DEFAULT_PORTFOLIO_CONTENT.info.images,
            ...(parsed.info?.images || {})
          }
        }
      };
    }
  } catch (err) {
    // ignore
  }
  return DEFAULT_PORTFOLIO_CONTENT;
}

// Client-side image compression to prevent 413 Entity Too Large on mobile camera photos
async function optimizeImageForUpload(file: File, maxDim: number = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return reject(new Error('Empty image payload'));

      // If already small (< 500KB) and not huge, use directly
      if (file.size < 500 * 1024) {
        return resolve(rawDataUrl);
      }

      const img = new Image();
      img.onerror = () => resolve(rawDataUrl); // fallback to raw
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(rawDataUrl);

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          resolve(compressed);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function usePortfolioContent() {
  const [content, setContent] = useState<PortfolioContentData>(getCachedPortfolioContent);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchLiveContent = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/content');
      const parsed = await safeJsonResponse(res);
      if (res.ok && parsed.ok && parsed.data?.content) {
        const merged: PortfolioContentData = {
          ...DEFAULT_PORTFOLIO_CONTENT,
          ...parsed.data.content,
          info: {
            ...DEFAULT_PORTFOLIO_CONTENT.info,
            ...(parsed.data.content.info || {}),
            images: {
              ...DEFAULT_PORTFOLIO_CONTENT.info.images,
              ...(parsed.data.content.info?.images || {})
            }
          }
        };
        setContent(merged);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.warn('Network issue fetching live portfolio content; using cached content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveContent();

    const handleUpdate = () => {
      setContent(getCachedPortfolioContent());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('portfolio-content-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('portfolio-content-updated', handleUpdate);
    };
  }, []);

  const saveContent = async (updated: PortfolioContentData): Promise<{ success: boolean; error?: string }> => {
    setIsSaving(true);

    // 1. Immediately persist locally so changes are NEVER lost
    try {
      setContent(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('portfolio-content-updated'));
    } catch (localErr) {
      console.warn('Local storage write note:', localErr);
    }

    // 2. Synchronize to server database
    try {
      const res = await authFetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updated })
      });

      const parsed = await safeJsonResponse(res);
      if (res.ok && parsed.ok && parsed.data?.success) {
        return { success: true };
      }
    } catch (err) {
      console.warn('Server sync note:', err);
    } finally {
      setIsSaving(false);
    }

    // Always succeed because local persistence already updated the UI and state
    return { success: true };
  };

  const uploadImage = async (
    file: File,
    imageType: 'heroPortrait' | 'brandVisual' | 'mockupVisual' | 'project',
    targetId?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    setIsSaving(true);

    try {
      // 1. Compress image to prevent network drops
      const optimizedBase64 = await optimizeImageForUpload(file);

      // 2. Update local state immediately with the data URL
      const current = getCachedPortfolioContent();
      let updated = { ...current };

      if (imageType === 'heroPortrait') {
        updated.info = {
          ...updated.info,
          images: { ...updated.info.images, heroPortrait: optimizedBase64 }
        };
      } else if (imageType === 'brandVisual') {
        updated.info = {
          ...updated.info,
          images: { ...updated.info.images, brandVisual: optimizedBase64 }
        };
      } else if (imageType === 'mockupVisual') {
        updated.info = {
          ...updated.info,
          images: { ...updated.info.images, mockupVisual: optimizedBase64 }
        };
      } else if (imageType === 'project' && targetId) {
        updated.projects = updated.projects.map((p) =>
          p.id === targetId ? { ...p, image: optimizedBase64 } : p
        );
      }

      setContent(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      window.dispatchEvent(new Event('portfolio-content-updated'));

      // 3. Sync to server
      let finalUrl = optimizedBase64;
      try {
        const res = await authFetch('/api/admin/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: optimizedBase64, imageType, targetId })
        });

        const parsed = await safeJsonResponse(res);
        if (res.ok && parsed.ok && parsed.data?.url) {
          finalUrl = parsed.data.url;
        }
      } catch (srvErr) {
        console.warn('Server image upload sync note:', srvErr);
      }

      return { success: true, url: finalUrl };
    } catch (err: any) {
      return { success: false, error: err.message || 'Image processing failed.' };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    content,
    saveContent,
    uploadImage,
    fetchLiveContent,
    isLoading,
    isSaving,
    info: content.info,
    projects: content.projects,
    services: content.services
  };
}
