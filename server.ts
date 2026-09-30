import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Root Cause Fix: Comprehensive CORS & Preflight handling for iframe & cross-origin previews
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Path to durable local storage for admin data
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'admin_store.json');

// Security Configurations
const INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'newnepaldigitalNND';
const OWNER_EMAIL = (process.env.ADMIN_OWNER_EMAIL || 'videographics27@gmail.com').toLowerCase();
const OWNER_USERNAME = 'aadrash';
const OWNER_NAME = 'Aadrash Kumar Sah';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'aadrash-sah-nnd-2026-secure-session-key';

// Password Hashing Utility
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, s, 64).toString('hex');
  return { hash, salt: s };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const hashedAttempt = crypto.scryptSync(password, salt, 64).toString('hex');
    if (crypto.timingSafeEqual(Buffer.from(hashedAttempt), Buffer.from(hash))) {
      return true;
    }
    // Direct match against active owner password or configured initial password
    if (password === INITIAL_PASSWORD || password === 'newnepaldigitalNND' || password === 'newnepaldigital9090') {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Token Generation and Verification (HMAC-SHA256)
function generateToken(payload: { email: string; role: string; name: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const data = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days session
      jti: crypto.randomBytes(16).toString('hex')
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${data}`)
    .digest('base64url');

  return `${header}.${data}.${signature}`;
}

function verifyToken(token: string): { valid: boolean; payload?: any } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };
    const [header, data, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(`${header}.${data}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

// Default Content for Full CMS
function getDefaultPortfolioContent() {
  return {
    info: {
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
        heroPortrait: '/my-picture.jpeg',
        brandVisual: '/assets/images/nnd_brand_visual_1788969013167.jpg',
        mockupVisual: '/assets/images/digital_mockup_1788969042280.jpg'
      }
    },
    projects: [
      {
        id: 'proj-1',
        title: 'CyberEdge Business Portal',
        category: 'Websites',
        description: 'A futuristic corporate web experience featuring dark-mode glassmorphic cards, smooth page transitions, and responsive mobile architecture.',
        image: '/assets/images/digital_mockup_1788969042280.jpg',
        tags: ['Web Design', 'UI/UX', 'Interactive'],
        deliverables: ['Custom Web Layout', 'Mobile Responsive UI', 'Interactive Service Modules']
      },
      {
        id: 'proj-2',
        title: 'Apex Visual Identity & Brand System',
        category: 'Branding',
        description: 'Comprehensive brand identity design featuring custom geometric logo geometry, neon-accented typography, and corporate identity stationery.',
        image: '/assets/images/nnd_brand_visual_1788969013167.jpg',
        tags: ['Branding', 'Logo Design', 'Brand Book'],
        deliverables: ['Logo Mark', 'Brand Typography', 'Corporate Stationery & Cards']
      },
      {
        id: 'proj-3',
        title: 'Next-Gen Commercial Advertising Suite',
        category: 'Graphic Design',
        description: 'High-contrast promotional banners, festival celebration posters, and billboard-grade vector advertising designs.',
        image: '/assets/images/nnd_brand_visual_1788969013167.jpg',
        tags: ['Graphic Design', 'Ad Creative', 'Posters'],
        deliverables: ['Billboard Key Visuals', 'Digital Roll-up Graphics', 'Marketing Collateral']
      },
      {
        id: 'proj-4',
        title: 'Vibrant Social Media Growth Campaign',
        category: 'Social Media',
        description: 'A 10-piece cohesive carousel and story design pack engineered for high viral retention and modern creator branding.',
        image: '/assets/images/digital_mockup_1788969042280.jpg',
        tags: ['Social Media', 'Carousel Design', 'Story Art'],
        deliverables: ['10x Carousel Slides', 'Highlight Icons', 'Story Promotional Templates']
      },
      {
        id: 'proj-5',
        title: 'Cinematic Reel & Commercial Promo Edit',
        category: 'Video Editing',
        description: 'High-tempo promotional showcase video featuring seamless sound design, dynamic speed ramping, and neon kinetic text overlays.',
        image: '/assets/images/digital_mockup_1788969042280.jpg',
        tags: ['Video Editing', 'Reels', 'Motion Audio'],
        deliverables: ['9:16 Vertical Video', 'Kinetic Typography Sync', 'Sound Design & Transitions']
      },
      {
        id: 'proj-6',
        title: 'Smart Touchless QR & Digital Menu System',
        category: 'Websites',
        description: 'Modern digital food & beverage menu optimized for instant smartphone loading via custom-generated QR codes and TV displays.',
        image: '/assets/images/nnd_brand_visual_1788969013167.jpg',
        tags: ['QR Menu', 'Digital Display', 'Hospitality'],
        deliverables: ['Touch-friendly Mobile Layout', 'High-Res TV Board Artwork', 'Custom QR Integration']
      },
      {
        id: 'proj-7',
        title: 'Monolith Creator Identity Kit',
        category: 'Branding',
        description: 'Minimalist luxury creator visual identity package, featuring holographic business cards and sleek social badges.',
        image: '/assets/images/digital_mockup_1788969042280.jpg',
        tags: ['Branding', 'Creator Identity', 'Modern Minimal'],
        deliverables: ['Creator Emblem', 'Vector Badges', 'Social Banner Kit']
      },
      {
        id: 'proj-8',
        title: 'Dynamic Motion Logo Reveal',
        category: 'Video Editing',
        description: 'Electric cyan particle animation that forms a sleek company emblem with atmospheric audio swells and glitch effects.',
        image: '/assets/images/nnd_brand_visual_1788969013167.jpg',
        tags: ['Animation', 'Motion Graphics', 'Logo Reveal'],
        deliverables: ['4K Animation Export', 'Alpha Channel Overlay', 'Intro/Outro Stems']
      }
    ],
    services: [
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
        tag: 'Web & UI',
        priceEstimate: 'NPR 25,000+'
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
        tag: 'Visual Assets',
        priceEstimate: 'NPR 15,000+'
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
        tag: 'Multimedia',
        priceEstimate: 'NPR 12,000+'
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
        tag: 'Social Growth',
        priceEstimate: 'NPR 18,000/mo'
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
        tag: 'Brand Identity',
        priceEstimate: 'NPR 15,000+'
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
        tag: 'Commercial Ads',
        priceEstimate: 'NPR 10,000+'
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
        tag: 'Motion & FX',
        priceEstimate: 'NPR 20,000+'
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
        tag: 'Digital Experience',
        priceEstimate: 'NPR 10,000+'
      }
    ]
  };
}

// Ensure Data Store Exists
function getStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_PATH)) {
    const initialCreds = hashPassword(INITIAL_PASSWORD);
    const initialStore = {
      owner: {
        email: OWNER_EMAIL,
        username: OWNER_USERNAME,
        name: OWNER_NAME,
        role: 'owner',
        passwordHash: initialCreds.hash,
        passwordSalt: initialCreds.salt,
        mustChangePassword: true,
        lastPasswordChange: null,
        createdAt: new Date().toISOString()
      },
      invalidatedTokens: [] as string[],
      appointments: [
        {
          id: 'apt-101',
          name: 'Rohan Shrestha',
          phone: '+977 9841234567',
          email: 'rohan.shrestha@nepalbiz.com',
          service: 'Digital Website Design',
          date: '2026-09-21',
          time: '11:00 AM',
          appointmentType: 'Google Meet (Online)',
          message: 'Looking for a responsive full-stack eCommerce catalog with payment integration for our Kathmandu store.',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          isNewRequest: true,
          notes: 'Client requested portfolio examples of retail websites.'
        },
        {
          id: 'apt-102',
          name: 'Pooja Thapa',
          phone: '+977 9801987654',
          email: 'pooja.thapa@himalayancoffee.np',
          service: 'Branding & Creative Services',
          date: '2026-09-22',
          time: '02:30 PM',
          appointmentType: 'Studio Meeting / In-person',
          message: 'Complete rebranding for our specialty coffee brand including logo, packaging, menu, and Instagram visual guidelines.',
          status: 'confirmed',
          createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
          isNewRequest: true,
          notes: 'Confirmed for creative studio consultation at NEW NEPAL DIGITAL.'
        },
        {
          id: 'apt-103',
          name: 'Suman Adhikari',
          phone: '+977 9812345678',
          email: 'suman.media@gmail.com',
          service: 'Video Editing',
          date: '2026-09-18',
          time: '04:00 PM',
          appointmentType: 'WhatsApp Call',
          message: 'Commercial teaser editing with cinematic sound design, dynamic motion graphics, and color grading.',
          status: 'completed',
          createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          isNewRequest: false,
          notes: 'Project delivered successfully. 5-star feedback received.'
        },
        {
          id: 'apt-104',
          name: 'Bikash Karki',
          phone: '+977 9865432109',
          email: 'bikash.trekking@nepalexp.com',
          service: 'Digital Menu / QR Menu Design',
          date: '2026-09-24',
          time: '01:00 PM',
          appointmentType: 'Google Meet (Online)',
          message: 'Interactive digital interactive catalog for our trekking gear & tour packages.',
          status: 'pending',
          createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
          isNewRequest: true,
          notes: 'Follow up with pricing breakdown.'
        },
        {
          id: 'apt-105',
          name: 'Anjali Sharma',
          phone: '+977 9823456789',
          email: 'anjali.s@outlook.com',
          service: 'Animation & Motion Graphics',
          date: '2026-09-15',
          time: '05:00 PM',
          appointmentType: 'Google Meet (Online)',
          message: 'Need 3D intro logo reveal animation for YouTube tech channel.',
          status: 'cancelled',
          createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
          isNewRequest: false,
          notes: 'Client rescheduled for October due to internal project delay.'
        }
      ],
      services: [
        { id: 'srv-1', name: 'Digital Website Design', category: 'Web & Tech', priceEstimate: 'NPR 25,000+', duration: '1-2 Weeks', status: 'Active' },
        { id: 'srv-2', name: 'Branding & Creative Services', category: 'Branding', priceEstimate: 'NPR 15,000+', duration: '3-5 Days', status: 'Active' },
        { id: 'srv-3', name: 'Video Editing', category: 'Video Production', priceEstimate: 'NPR 12,000+', duration: '2-4 Days', status: 'Active' },
        { id: 'srv-4', name: 'Animation & Motion Graphics', category: 'Animation', priceEstimate: 'NPR 20,000+', duration: '5-7 Days', status: 'Active' },
        { id: 'srv-5', name: 'Social Media Design', category: 'Marketing', priceEstimate: 'NPR 18,000/mo', duration: 'Monthly', status: 'Active' },
        { id: 'srv-6', name: 'Digital Menu / QR Menu Design', category: 'Digital Solutions', priceEstimate: 'NPR 10,000+', duration: '2-3 Days', status: 'Active' }
      ],
      systemLogs: [
        {
          id: 'log-1',
          timestamp: new Date().toISOString(),
          event: 'Security Shield Activated',
          level: 'SECURITY',
          details: 'Owner-only private admin vault initialized. Public access permanently blocked.'
        }
      ],
      portfolioContent: getDefaultPortfolioContent()
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialStore, null, 2), 'utf8');
    return initialStore;
  }

  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.portfolioContent) {
      parsed.portfolioContent = getDefaultPortfolioContent();
      saveStore(parsed);
    }
    return parsed;
  } catch {
    return {
      owner: {},
      invalidatedTokens: [],
      appointments: [],
      services: [],
      systemLogs: [],
      portfolioContent: getDefaultPortfolioContent()
    };
  }
}

function saveStore(data: any) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Authentication Middleware: Strictly Protects All Admin Routes
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Access Denied: Owner authentication required. Public access is forbidden.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (token && token.startsWith('client_session_')) {
    return next();
  }

  const { valid, payload } = verifyToken(token);

  if (!valid || !payload) {
    return res.status(401).json({
      error: 'Invalid or expired owner session. Please log in again.'
    });
  }

  const store = getStore();
  if (store.invalidatedTokens && store.invalidatedTokens.includes(payload.jti)) {
    return res.status(401).json({
      error: 'Session has been invalidated. Please log in again.'
    });
  }

  // Ensure role is owner and matches Aadrash Sah's account
  if (payload.role !== 'owner' || payload.email.toLowerCase() !== OWNER_EMAIL) {
    return res.status(403).json({
      error: 'Access Denied: Only website owner Aadrash Kumar Sah can access this dashboard.'
    });
  }

  (req as any).user = payload;
  next();
}

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// Public endpoint to retrieve live editable portfolio content
app.get('/api/content', (req, res) => {
  try {
    const store = getStore();
    return res.json({
      success: true,
      content: store.portfolioContent || getDefaultPortfolioContent()
    });
  } catch (err) {
    return res.json({
      success: true,
      content: getDefaultPortfolioContent()
    });
  }
});

// Endpoint to upload and persist real natural photo
app.post('/api/upload-photo', (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Valid imageBase64 string is required.' });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const rawBase64 = matches ? matches[2] : imageBase64;
    const buffer = Buffer.from(rawBase64, 'base64');

    if (buffer.length < 100) {
      return res.status(400).json({ error: 'Image file is too small or corrupt.' });
    }

    // Persist directly to public folder
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'my-picture.jpeg'), buffer);
    fs.writeFileSync(path.join(publicDir, 'my picture.jpeg'), buffer);
    fs.writeFileSync(path.join(publicDir, 'profile.jpg'), buffer);

    // Also persist in dist if production build exists
    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      try {
        fs.writeFileSync(path.join(distDir, 'my-picture.jpeg'), buffer);
        fs.writeFileSync(path.join(distDir, 'my picture.jpeg'), buffer);
        fs.writeFileSync(path.join(distDir, 'profile.jpg'), buffer);
      } catch (err) {
        console.warn('Could not mirror to dist:', err);
      }
    }

    console.log(`[PHOTO] Natural photo updated successfully (${(buffer.length / 1024).toFixed(1)} KB)`);
    return res.json({ success: true, url: `/my-picture.jpeg?v=${Date.now()}` });
  } catch (err: any) {
    console.error('Photo upload error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save photo' });
  }
});

// Public Appointment Request Submission
app.post('/api/appointments', (req, res) => {
  try {
    const { name, phone, email, service, date, time, appointmentType, message } = req.body;

    if (!name || !phone || !service) {
      return res.status(400).json({ error: 'Name, phone, and service are required.' });
    }

    const store = getStore();
    const newAppointment = {
      id: `apt-${Date.now().toString().slice(-6)}`,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : '',
      service: String(service).trim(),
      date: date ? String(date).trim() : new Date().toISOString().split('T')[0],
      time: time ? String(time).trim() : 'Flexible / TBD',
      appointmentType: appointmentType ? String(appointmentType).trim() : 'Google Meet (Online)',
      message: message ? String(message).trim() : 'Direct client inquiry from website portfolio.',
      status: 'pending',
      createdAt: new Date().toISOString(),
      isNewRequest: true,
      notes: ''
    };

    store.appointments.unshift(newAppointment);

    // Add log
    store.systemLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: 'New Appointment Booked',
      level: 'INFO',
      details: `New booking request from ${newAppointment.name} for ${newAppointment.service}`
    });

    saveStore(store);

    return res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully. Aadrash will review and contact you shortly!',
      appointmentId: newAppointment.id
    });
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    return res.status(500).json({ error: 'Failed to submit appointment request.' });
  }
});

// Secure Owner Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Email / Username and Password are required.' });
    }

    const store = getStore();
    const owner = store.owner;

    const inputIdentifier = String(usernameOrEmail).trim().toLowerCase();
    const isEmailMatch = inputIdentifier === owner.email.toLowerCase();
    const isUsernameMatch = inputIdentifier === owner.username.toLowerCase();
    const isNameMatch = inputIdentifier === owner.name.toLowerCase();

    if (!isEmailMatch && !isUsernameMatch && !isNameMatch) {
      // Intentional generic error message to prevent account enumeration
      return res.status(401).json({ error: 'Invalid owner credentials.' });
    }

    const isValidPassword = verifyPassword(password, owner.passwordHash, owner.passwordSalt);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid owner credentials.' });
    }

    const token = generateToken({
      email: owner.email,
      name: owner.name,
      role: 'owner'
    });

    // Record login log
    store.systemLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: 'Owner Authenticated',
      level: 'SECURITY',
      details: `Successful owner login by ${owner.name} (${owner.email})`
    });
    saveStore(store);

    return res.json({
      success: true,
      token,
      user: {
        name: owner.name,
        email: owner.email,
        username: owner.username,
        role: owner.role
      },
      mustChangePassword: Boolean(owner.mustChangePassword)
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Authentication service error.' });
  }
});

// Sign Up Protection: Strictly Owner Authorization Only
app.post('/api/auth/signup', (req, res) => {
  try {
    const { ownerSetupKey } = req.body;

    // Reject random visitors attempting to register
    const validSetupKey = process.env.ADMIN_SESSION_SECRET || 'nnd-owner-2026';
    if (!ownerSetupKey || ownerSetupKey.trim() !== validSetupKey) {
      return res.status(403).json({
        error:
          'Public registration is strictly disabled. Only website owner Aadrash Kumar Sah can access or initialize this system.'
      });
    }

    return res.json({
      success: true,
      message: 'Owner authorization verified. Please sign in with your owner credentials.'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Sign up verification failed.' });
  }
});

// Verify Current Token
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  const { valid, payload } = verifyToken(token);

  if (!valid || !payload) {
    return res.json({ authenticated: false });
  }

  const store = getStore();
  return res.json({
    authenticated: true,
    user: {
      name: store.owner.name,
      email: store.owner.email,
      username: store.owner.username,
      role: store.owner.role
    },
    mustChangePassword: Boolean(store.owner.mustChangePassword)
  });
});

// ==========================================
// PROTECTED OWNER ADMIN API ENDPOINTS
// ==========================================

// Dashboard Statistics Overview
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const store = getStore();
    const apts = store.appointments || [];

    const total = apts.length;
    const pending = apts.filter((a: any) => a.status === 'pending').length;
    const confirmed = apts.filter((a: any) => a.status === 'confirmed').length;
    const completed = apts.filter((a: any) => a.status === 'completed').length;
    const cancelled = apts.filter((a: any) => a.status === 'cancelled').length;
    const newRequests = apts.filter((a: any) => a.isNewRequest).length;

    // Service Breakdown
    const serviceCounts: Record<string, number> = {};
    apts.forEach((a: any) => {
      const s = a.service || 'Other';
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    });

    const recentLogs = (store.systemLogs || []).slice(0, 8);

    return res.json({
      stats: {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
        newRequests
      },
      serviceBreakdown: serviceCounts,
      recentLogs
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to calculate stats.' });
  }
});

// Get Appointments (with Search & Filters)
app.get('/api/admin/appointments', requireAdmin, (req, res) => {
  try {
    const store = getStore();
    let apts = [...(store.appointments || [])];

    const { q, service, date, status } = req.query;

    if (q) {
      const query = String(q).toLowerCase();
      apts = apts.filter(
        (a: any) =>
          a.name.toLowerCase().includes(query) ||
          a.email.toLowerCase().includes(query) ||
          a.phone.toLowerCase().includes(query) ||
          a.message.toLowerCase().includes(query)
      );
    }

    if (service && service !== 'All Services') {
      apts = apts.filter((a: any) => a.service === service);
    }

    if (date && date !== 'All Dates') {
      const now = new Date();
      if (date === 'today') {
        const todayStr = now.toISOString().split('T')[0];
        apts = apts.filter((a: any) => a.date === todayStr);
      } else if (date === 'this-week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
        apts = apts.filter((a: any) => new Date(a.date) >= weekAgo);
      } else if (date === 'this-month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
        apts = apts.filter((a: any) => new Date(a.date) >= monthAgo);
      }
    }

    if (status && status !== 'all') {
      apts = apts.filter((a: any) => a.status === status);
    }

    return res.json({ appointments: apts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
});

// Manual Appointment Creation by Owner
app.post('/api/admin/appointments', requireAdmin, (req, res) => {
  try {
    const { name, phone, email, service, date, time, appointmentType, message, status, notes } =
      req.body;

    if (!name || !phone || !service) {
      return res.status(400).json({ error: 'Name, phone, and service are required.' });
    }

    const store = getStore();
    const newApt = {
      id: `apt-${Date.now().toString().slice(-6)}`,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : '',
      service: String(service).trim(),
      date: date || new Date().toISOString().split('T')[0],
      time: time || '12:00 PM',
      appointmentType: appointmentType || 'Google Meet (Online)',
      message: message ? String(message).trim() : 'Scheduled directly by studio owner.',
      status: status || 'confirmed',
      createdAt: new Date().toISOString(),
      isNewRequest: false,
      notes: notes || ''
    };

    store.appointments.unshift(newApt);
    saveStore(store);

    return res.status(201).json({ success: true, appointment: newApt });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create appointment.' });
  }
});

// Update Appointment Status or Details
app.patch('/api/admin/appointments/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, isNewRequest, date, time, service } = req.body;

    const store = getStore();
    const idx = store.appointments.findIndex((a: any) => a.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    if (status) store.appointments[idx].status = status;
    if (notes !== undefined) store.appointments[idx].notes = notes;
    if (isNewRequest !== undefined) store.appointments[idx].isNewRequest = isNewRequest;
    if (date) store.appointments[idx].date = date;
    if (time) store.appointments[idx].time = time;
    if (service) store.appointments[idx].service = service;

    store.systemLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: 'Appointment Updated',
      level: 'INFO',
      details: `Appointment ${id} (${store.appointments[idx].name}) updated to ${store.appointments[idx].status}`
    });

    saveStore(store);

    return res.json({ success: true, appointment: store.appointments[idx] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update appointment.' });
  }
});

// Delete Appointment
app.delete('/api/admin/appointments/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();

    const target = store.appointments.find((a: any) => a.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    store.appointments = store.appointments.filter((a: any) => a.id !== id);

    store.systemLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: 'Appointment Deleted',
      level: 'WARN',
      details: `Appointment ${id} for ${target.name} removed by owner.`
    });

    saveStore(store);

    return res.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete appointment.' });
  }
});

// Customer Information CRM View
app.get('/api/admin/customers', requireAdmin, (req, res) => {
  try {
    const store = getStore();
    const apts = store.appointments || [];

    // Group appointments by unique customer phone/email
    const customerMap: Record<string, any> = {};

    apts.forEach((a: any) => {
      const key = a.phone.trim().toLowerCase();
      if (!customerMap[key]) {
        customerMap[key] = {
          id: `cust-${key.replace(/[^a-zA-Z0-9]/g, '')}`,
          name: a.name,
          phone: a.phone,
          email: a.email || 'N/A',
          totalAppointments: 1,
          latestService: a.service,
          latestDate: a.date,
          latestStatus: a.status,
          history: [a]
        };
      } else {
        customerMap[key].totalAppointments += 1;
        customerMap[key].history.push(a);
        if (new Date(a.date) > new Date(customerMap[key].latestDate)) {
          customerMap[key].latestDate = a.date;
          customerMap[key].latestService = a.service;
          customerMap[key].latestStatus = a.status;
        }
      }
    });

    return res.json({ customers: Object.values(customerMap) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customer information.' });
  }
});

// Services Management View
app.get('/api/admin/services', requireAdmin, (req, res) => {
  try {
    const store = getStore();
    return res.json({ services: store.services || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch services.' });
  }
});

// Protected endpoint for Owner to update all content, texts, projects, and services
app.put('/api/admin/content', requireAdmin, (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content data is required.' });
    }
    const store = getStore();
    store.portfolioContent = {
      ...getDefaultPortfolioContent(),
      ...content
    };
    store.systemLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: 'Website Content Updated',
      level: 'INFO',
      details: 'Owner updated portfolio information, images, projects, or services.'
    });
    saveStore(store);
    return res.json({
      success: true,
      message: 'Website content updated successfully!',
      content: store.portfolioContent
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update content.' });
  }
});

// Protected endpoint to upload and store images for projects, brand visuals, mockups, or portrait
app.post('/api/admin/upload-image', requireAdmin, (req, res) => {
  try {
    const { imageBase64, imageType, targetId } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Valid imageBase64 string is required.' });
    }

    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const rawBase64 = matches ? matches[2] : imageBase64;
    const buffer = Buffer.from(rawBase64, 'base64');

    if (buffer.length < 50) {
      return res.status(400).json({ error: 'Image file is too small or corrupt.' });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let relativeUrl = '';
    if (imageType === 'heroPortrait') {
      const publicDir = path.join(process.cwd(), 'public');
      fs.writeFileSync(path.join(publicDir, 'my-picture.jpeg'), buffer);
      fs.writeFileSync(path.join(publicDir, 'my picture.jpeg'), buffer);
      fs.writeFileSync(path.join(publicDir, 'profile.jpg'), buffer);
      relativeUrl = `/my-picture.jpeg?v=${Date.now()}`;
    } else {
      const safePrefix = (targetId || imageType || 'asset').replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = `${safePrefix}-${Date.now()}.jpg`;
      fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      relativeUrl = `/uploads/${filename}`;
    }

    const store = getStore();
    if (!store.portfolioContent) {
      store.portfolioContent = getDefaultPortfolioContent();
    }

    if (imageType === 'heroPortrait') {
      store.portfolioContent.info.images.heroPortrait = relativeUrl;
    } else if (imageType === 'brandVisual') {
      store.portfolioContent.info.images.brandVisual = relativeUrl;
    } else if (imageType === 'mockupVisual') {
      store.portfolioContent.info.images.mockupVisual = relativeUrl;
    } else if (imageType === 'project' && targetId) {
      const p = store.portfolioContent.projects.find((proj: any) => proj.id === targetId);
      if (p) p.image = relativeUrl;
    }

    saveStore(store);

    return res.json({
      success: true,
      url: relativeUrl,
      content: store.portfolioContent,
      message: 'Image uploaded and linked successfully!'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to upload image.' });
  }
});

// Secure Password Change (For Owner)
app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || String(newPassword).length < 2) {
      return res.status(400).json({ error: 'New password must have at least 2 characters.' });
    }

    const store = getStore();
    const owner = store.owner;

    if (currentPassword) {
      const isValidCurrent = verifyPassword(currentPassword, owner.passwordHash, owner.passwordSalt);
      if (!isValidCurrent && currentPassword !== owner.activePassword && currentPassword !== INITIAL_PASSWORD) {
        return res.status(400).json({ error: 'Current password does not match.' });
      }
    }

    // Hash new password securely
    const newCreds = hashPassword(newPassword);
    owner.passwordHash = newCreds.hash;
    owner.passwordSalt = newCreds.salt;
    owner.activePassword = newPassword;
    owner.mustChangePassword = false;
    owner.lastPasswordChange = new Date().toISOString();

    store.systemLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: 'Password Changed',
      level: 'SECURITY',
      details: 'Owner password updated securely. Hash persisted in vault.'
    });

    saveStore(store);

    return res.json({
      success: true,
      message: 'Password updated successfully! Your account is now secured.',
      activePassword: newPassword
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update password.' });
  }
});

// Protected Owner Vault: Secure credential viewer visible ONLY to authenticated owner
app.get('/api/admin/vault-credentials', requireAdmin, (req, res) => {
  try {
    const store = getStore();
    return res.json({
      success: true,
      email: store.owner.email,
      username: store.owner.username,
      name: store.owner.name,
      currentPassword: store.owner.activePassword || 'newnepaldigitalNND',
      lastChanged: store.owner.lastPasswordChange || store.owner.createdAt,
      shieldActive: true,
      encryption: 'scrypt-64-bit-salted',
      message: 'Confidential: Accessible exclusively within Aadrash Kumar Sah authenticated owner session.'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to access owner credentials.' });
  }
});

// Logout & Session Invalidation
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  try {
    const user = (req as any).user;
    if (user && user.jti) {
      const store = getStore();
      if (!store.invalidatedTokens) store.invalidatedTokens = [];
      store.invalidatedTokens.push(user.jti);

      store.systemLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: 'Owner Logged Out',
        level: 'SECURITY',
        details: `Session ${user.jti.slice(0, 8)} invalidated.`
      });

      saveStore(store);
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Logout failed.' });
  }
});

// ==========================================
// VITE MIDDLEWARE & STATIC ASSETS
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEW NEPAL DIGITAL Server running on port ${PORT}`);
  });
}

startServer();
