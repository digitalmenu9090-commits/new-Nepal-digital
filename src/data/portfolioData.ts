import { SkillItem, ServiceItem, ProjectItem, TimelineMilestone, StatItem } from '../types';
import aadrashPortraitImg from '../assets/images/aadrash_authentic_photo_1789393033546.jpg';
import nndBrandImg from '../assets/images/nnd_brand_visual_1788969013167.jpg';
import digitalMockupImg from '../assets/images/digital_mockup_1788969042280.jpg';

export const PORTFOLIO_INFO = {
  name: 'Aadrash Sah',
  title: 'Founder & Digital Creator',
  brand: 'NEW NEPAL DIGITAL',
  tagline: 'Your Business, Digitally Better.',
  welcomeText: 'WELCOME TO MY DIGITAL WORLD',
  heroHeading: "Hi, I'm Aadrash Sah.",
  animatedTitles: [
    'Founder',
    'Digital Creator',
    'Web Designer',
    'Creative Designer'
  ],
  heroDescription: 'I create modern digital experiences through web design, graphic design, video editing, branding, animation, and creative technology.',
  aboutParagraphs: [
    "I'm Aadrash Sah, a passionate Digital Creator and Founder of NEW NEPAL DIGITAL. I enjoy creating modern websites, digital designs, promotional content, videos, branding materials, and creative digital experiences.",
    "My goal is to combine creativity and technology to create professional digital experiences that help businesses and brands stand out."
  ],
  contactNumbers: ['9704135338', '9717126332'],
  instagramHandle: '@black_snow35',
  instagramUrl: 'https://instagram.com/black_snow35',
  whatsappNumber: '9704135338',
  whatsappUrl: 'https://wa.me/9779704135338',
  workingHours: '24 Hours Open (24/7)',
  availabilityStatus: '24 Hours Open • Always Active',
  images: {
    heroPortrait: aadrashPortraitImg,
    brandVisual: nndBrandImg,
    mockupVisual: digitalMockupImg,
  }
};

export const CREATIVE_JOURNEY: TimelineMilestone[] = [
  {
    year: 'Phase 01',
    title: 'Visual Arts & Graphic Design Foundations',
    role: 'Creative Discovery',
    description: 'Began exploring digital media, visual typography, poster creation, and commercial brand aesthetics.',
    highlight: 'Mastered Core Layouts & Vector Design'
  },
  {
    year: 'Phase 02',
    title: 'Motion, Video Editing & Social Media',
    role: 'Motion Creator',
    description: 'Expanded into high-impact video reels, animated promos, and attention-grabbing social media campaign graphics.',
    highlight: 'Dynamic Editing & Cinematic Pacing'
  },
  {
    year: 'Phase 03',
    title: 'Web Design & Interactive Digital Tech',
    role: 'Digital Designer',
    description: 'Pioneered smart digital menu experiences, QR systems, and sleek responsive websites tailored for business growth.',
    highlight: 'Responsive Web Architecture & QR Systems'
  },
  {
    year: 'Phase 04',
    title: 'Founding of NEW NEPAL DIGITAL',
    role: 'Founder & Creative Lead',
    description: 'Established NEW NEPAL DIGITAL to provide full-spectrum digital design, branding, and digital transformations for businesses.',
    highlight: 'Your Business, Digitally Better.'
  }
];

export const SKILLS: SkillItem[] = [
  {
    id: 'web-design',
    name: 'Web Design',
    level: 'Advanced Specialist',
    category: 'Design',
    description: 'Crafting responsive, high-performance web layouts, sleek user interfaces, and mobile-first layouts.',
    iconName: 'Layout',
    ratingTier: 95
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    level: 'Mastery',
    category: 'Design',
    description: 'Composition, color theory, digital banners, marketing collaterals, and high-impact visual design.',
    iconName: 'Palette',
    ratingTier: 98
  },
  {
    id: 'canva-design',
    name: 'Canva Design',
    level: 'Expert Workflow',
    category: 'Creative',
    description: 'Rapid, polished design systems, editable templates, promotional flyers, and social collateral.',
    iconName: 'Sparkles',
    ratingTier: 96
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    level: 'Advanced Specialist',
    category: 'Motion & Tech',
    description: 'Cinematic video storytelling, reel pacing, sound design, transitions, and commercial promotional edits.',
    iconName: 'Film',
    ratingTier: 92
  },
  {
    id: 'social-media-design',
    name: 'Social Media Design',
    level: 'Specialist',
    category: 'Creative',
    description: 'Trend-setting Instagram feeds, carousel designs, story aesthetics, and cohesive brand feeds.',
    iconName: 'Share2',
    ratingTier: 94
  },
  {
    id: 'branding',
    name: 'Branding',
    level: 'Strategic Lead',
    category: 'Design',
    description: 'Visual identity kits, logo conception, brand typography, guidelines, and corporate stationery.',
    iconName: 'Layers',
    ratingTier: 95
  },
  {
    id: 'advertisement-design',
    name: 'Advertisement Design',
    level: 'Commercial Specialist',
    category: 'Creative',
    description: 'High-converting display ads, promotional banners, sales graphics, and campaign creatives.',
    iconName: 'Megaphone',
    ratingTier: 91
  },
  {
    id: 'digital-menu-design',
    name: 'Digital Menu Design',
    level: 'Industry Specialist',
    category: 'Motion & Tech',
    description: 'High-definition digital menu board layouts, cafe/restaurant visual displays, and category hierarchy.',
    iconName: 'Tv',
    ratingTier: 96
  },
  {
    id: 'qr-menu-design',
    name: 'QR Menu Design',
    level: 'Next-Gen Workflow',
    category: 'Motion & Tech',
    description: 'Contactless smartphone-friendly menus, instant QR code integration, and seamless customer browsing.',
    iconName: 'QrCode',
    ratingTier: 95
  },
  {
    id: 'animation-motion-graphics',
    name: 'Animation & Motion Graphics',
    level: 'Creative Director',
    category: 'Motion & Tech',
    description: 'Dynamic kinetic typography, animated logo reveals, lower thirds, and futuristic motion assets.',
    iconName: 'Activity',
    ratingTier: 90
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    level: 'Creator',
    category: 'Creative',
    description: 'End-to-end creative ideation, visual content strategy, copywriting hooks, and multimedia production.',
    iconName: 'Compass',
    ratingTier: 93
  },
  {
    id: 'creative-direction',
    name: 'Creative Direction',
    level: 'Brand Founder',
    category: 'Creative',
    description: 'Holistic visual leadership, aesthetic curation, brand positioning, and project execution management.',
    iconName: 'Target',
    ratingTier: 97
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'digital-website-design',
    title: 'Digital Website Design',
    description: 'Modern responsive websites for businesses, creators, and brands.',
    features: [
      'Tailored responsive layouts across mobile, tablet, and desktop',
      'Futuristic visual identity, smooth interactions, and fast load times',
      'Conversion-focused architecture and structured call-to-actions'
    ],
    iconName: 'Globe',
    tag: 'Web & UI'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Posters, banners, promotional graphics, and digital materials.',
    features: [
      'High-resolution vector graphics and marketing collateral',
      'Event posters, display roll-ups, and corporate stationery',
      'Crisp typographic hierarchy and calibrated color balance'
    ],
    iconName: 'PenTool',
    tag: 'Visual Assets'
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'Creative promotional videos and social media content.',
    features: [
      'Dynamic reels, TikToks, YouTube shorts, and commercial edits',
      'Precise audio sync, color grading, and modern motion transitions',
      'Engaging hooks designed to capture and hold viewer attention'
    ],
    iconName: 'Video',
    tag: 'Multimedia'
  },
  {
    id: 'social-media-design',
    title: 'Social Media Design',
    description: 'Modern posts, stories, advertisements, and promotional graphics.',
    features: [
      'Consistent Instagram aesthetic themes and carousel designs',
      'Engaging story highlights, cover artwork, and campaign packs',
      'Formatted for high algorithmic engagement and brand recall'
    ],
    iconName: 'Instagram',
    tag: 'Social Growth'
  },
  {
    id: 'branding-creative-services',
    title: 'Branding & Creative Services',
    description: 'Logos, business cards, visual identity, and brand materials.',
    features: [
      'Custom logo conceptualization and vector iconography',
      'Comprehensive brand guideline books and font pairings',
      'Business cards, letterheads, and digital merchandise assets'
    ],
    iconName: 'Shield',
    tag: 'Brand Identity'
  },
  {
    id: 'advertisement-design',
    title: 'Advertisement Design',
    description: 'Professional digital advertisements.',
    features: [
      'Click-optimized social ad banners and Google display creatives',
      'Seasonal promotional posters and targeted promotional offers',
      'High-impact visuals engineered to drive measurable inquiries'
    ],
    iconName: 'Zap',
    tag: 'Commercial Ads'
  },
  {
    id: 'animation-motion-graphics',
    title: 'Animation & Motion Graphics',
    description: 'Modern animated promotional content.',
    features: [
      'Animated logo intros and holographic style title cards',
      'Kinetic typography promos and interactive UI micro-animations',
      'Engaging visual loops for digital screens and social media'
    ],
    iconName: 'PlayCircle',
    tag: 'Motion & FX'
  },
  {
    id: 'digital-menu-design',
    title: 'Digital Menu Design',
    description: 'Professional digital menus and QR-based menu experiences.',
    features: [
      'Interactive QR-activated menus accessible instantly on smartphones',
      'Sleek TV screen digital menu boards with categorized pricing',
      'Easy-to-update item formats with vivid culinary/product imagery'
    ],
    iconName: 'Smartphone',
    tag: 'Digital Experience'
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'CyberEdge Business Portal',
    category: 'Websites',
    description: 'A futuristic corporate web experience featuring dark-mode glassmorphic cards, smooth page transitions, and responsive mobile architecture.',
    image: digitalMockupImg,
    tags: ['Web Design', 'UI/UX', 'Interactive'],
    deliverables: ['Custom Web Layout', 'Mobile Responsive UI', 'Interactive Service Modules']
  },
  {
    id: 'proj-2',
    title: 'Apex Visual Identity & Brand System',
    category: 'Branding',
    description: 'Comprehensive brand identity design featuring custom geometric logo geometry, neon-accented typography, and corporate identity stationery.',
    image: nndBrandImg,
    tags: ['Branding', 'Logo Design', 'Brand Book'],
    deliverables: ['Logo Mark', 'Brand Typography', 'Corporate Stationery & Cards']
  },
  {
    id: 'proj-3',
    title: 'Next-Gen Commercial Advertising Suite',
    category: 'Graphic Design',
    description: 'High-contrast promotional banners, festival celebration posters, and billboard-grade vector advertising designs.',
    image: nndBrandImg,
    tags: ['Graphic Design', 'Ad Creative', 'Posters'],
    deliverables: ['Billboard Key Visuals', 'Digital Roll-up Graphics', 'Marketing Collateral']
  },
  {
    id: 'proj-4',
    title: 'Vibrant Social Media Growth Campaign',
    category: 'Social Media',
    description: 'A 10-piece cohesive carousel and story design pack engineered for high viral retention and modern creator branding.',
    image: digitalMockupImg,
    tags: ['Social Media', 'Carousel Design', 'Story Art'],
    deliverables: ['10x Carousel Slides', 'Highlight Icons', 'Story Promotional Templates']
  },
  {
    id: 'proj-5',
    title: 'Cinematic Reel & Commercial Promo Edit',
    category: 'Video Editing',
    description: 'High-tempo promotional showcase video featuring seamless sound design, dynamic speed ramping, and neon kinetic text overlays.',
    image: digitalMockupImg,
    tags: ['Video Editing', 'Reels', 'Motion Audio'],
    deliverables: ['9:16 Vertical Video', 'Kinetic Typography Sync', 'Sound Design & Transitions']
  },
  {
    id: 'proj-6',
    title: 'Smart Touchless QR & Digital Menu System',
    category: 'Websites',
    description: 'Modern digital food & beverage menu optimized for instant smartphone loading via custom-generated QR codes and TV displays.',
    image: nndBrandImg,
    tags: ['QR Menu', 'Digital Display', 'Hospitality'],
    deliverables: ['Touch-friendly Mobile Layout', 'High-Res TV Board Artwork', 'Custom QR Integration']
  },
  {
    id: 'proj-7',
    title: 'Monolith Creator Identity Kit',
    category: 'Branding',
    description: 'Minimalist luxury creator visual identity package, featuring holographic business cards and sleek social badges.',
    image: digitalMockupImg,
    tags: ['Branding', 'Creator Identity', 'Modern Minimal'],
    deliverables: ['Creator Emblem', 'Vector Badges', 'Social Banner Kit']
  },
  {
    id: 'proj-8',
    title: 'Dynamic Motion Logo Reveal',
    category: 'Video Editing',
    description: 'Electric cyan particle animation that forms a sleek company emblem with atmospheric audio swells and glitch effects.',
    image: nndBrandImg,
    tags: ['Animation', 'Motion Graphics', 'Logo Reveal'],
    deliverables: ['4K Animation Export', 'Alpha Channel Overlay', 'Intro/Outro Stems']
  }
];

export const STATS: StatItem[] = [
  {
    value: 12,
    suffix: '+',
    label: 'Core Creative Disciplines',
    description: 'From web engineering to motion graphics & branding'
  },
  {
    value: 100,
    suffix: '%',
    label: 'Custom Tailored Design',
    description: 'Zero generic templates; every pixel purposefully built'
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Direct Creator Support',
    description: 'Direct communication without administrative delays'
  },
  {
    value: 2,
    suffix: 'x',
    label: 'Digital Impact',
    description: 'Elevating local & modern brands into standout leaders'
  }
];
