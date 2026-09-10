export interface SkillItem {
  id: string;
  name: string;
  level: string;
  category: 'Design' | 'Creative' | 'Motion & Tech';
  description: string;
  iconName: string;
  ratingTier: number; // 1-5 or 1-100 for visual rings
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  iconName: string;
  tag: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Websites' | 'Branding' | 'Graphic Design' | 'Social Media' | 'Video Editing';
  description: string;
  image: string;
  tags: string[];
  deliverables: string[];
  status?: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  role: string;
  description: string;
  highlight: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}
