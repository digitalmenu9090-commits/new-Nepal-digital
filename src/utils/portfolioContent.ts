import { useState, useEffect } from 'react';
import { PORTFOLIO_INFO, PROJECTS, SERVICES, SKILLS, STATS } from '../data/portfolioData';
import { authFetch } from './adminAuth';

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

export function usePortfolioContent() {
  const [content, setContent] = useState<PortfolioContentData>(getCachedPortfolioContent);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchLiveContent = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          const merged: PortfolioContentData = {
            ...DEFAULT_PORTFOLIO_CONTENT,
            ...data.content,
            info: {
              ...DEFAULT_PORTFOLIO_CONTENT.info,
              ...(data.content.info || {}),
              images: {
                ...DEFAULT_PORTFOLIO_CONTENT.info.images,
                ...(data.content.info?.images || {})
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
      }
    } catch (err) {
      console.warn('Failed to load live portfolio content, using cache:', err);
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
    try {
      setIsSaving(true);
      const res = await authFetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updated })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to save changes.' };
      }

      setContent(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      window.dispatchEvent(new Event('portfolio-content-updated'));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error.' };
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImage = async (
    file: File,
    imageType: 'heroPortrait' | 'brandVisual' | 'mockupVisual' | 'project',
    targetId?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = e.target?.result as string;
        if (!imageBase64) {
          return resolve({ success: false, error: 'Could not read image file.' });
        }

        try {
          setIsSaving(true);
          const res = await authFetch('/api/admin/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64, imageType, targetId })
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            return resolve({ success: false, error: data.error || 'Failed to upload image.' });
          }

          if (data.content) {
            setContent(data.content);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.content));
            } catch {
              // ignore
            }
            window.dispatchEvent(new Event('portfolio-content-updated'));
          }

          resolve({ success: true, url: data.url });
        } catch (err: any) {
          resolve({ success: false, error: err.message || 'Network error during upload.' });
        } finally {
          setIsSaving(false);
        }
      };
      reader.readAsDataURL(file);
    });
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
