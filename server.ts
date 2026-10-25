import express, { Request, Response, NextFunction } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { BIRTHDAY_CONFIG } from './src/config/birthday';
import { sanitizeHtml, validateWish } from './src/utils/security';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Admin / Private Access password (defaults to lalee2026 if not set in environment)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lalee2026';

// Storage paths
const DATA_DIR = path.resolve(process.cwd(), 'data');
const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');
const MEMORIES_FILE = path.join(DATA_DIR, 'memories.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory active authentication tokens: token -> { createdAt, expiresAt }
const activeSessions = new Map<string, { createdAt: number; expiresAt: number }>();

// Simple IP rate-limiting for guest wish submissions
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

// Helper to safely load JSON file with fallback
function loadJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

// Helper to safely write JSON file atomically
function saveJsonFile<T>(filePath: string, data: T): void {
  try {
    const tempPath = `${filePath}.${Date.now()}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initial seed data if files don't exist
if (!fs.existsSync(WISHES_FILE)) {
  const seedWishes = [
    {
      id: 'wish-seed-1',
      name: 'Rohan Sharma',
      message: 'Happy Birthday Lalee! Keep inspiring everyone with your positive energy and kindness. Have an amazing year ahead!',
      createdAt: new Date(Date.now() - 3600 * 24 * 1000 * 2).toISOString(),
      status: 'approved',
    },
    {
      id: 'wish-seed-2',
      name: 'Priya & Team',
      message: 'Wishing you the happiest birthday Lalee! Hope your day is filled with good music, delicious food, and lots of laughter.',
      createdAt: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
      status: 'approved',
    },
  ];
  saveJsonFile(WISHES_FILE, seedWishes);
}

if (!fs.existsSync(MEMORIES_FILE)) {
  saveJsonFile(MEMORIES_FILE, BIRTHDAY_CONFIG.defaultMemories);
}

// Middleware
app.use(express.json({ limit: '1mb' }));

// Auth verification middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: missing or invalid authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    res.status(401).json({ error: 'Session expired or invalid token' });
    return;
  }

  next();
}

// --- API ROUTES ---

// 1. Public Config
app.get('/api/config', (_req: Request, res: Response) => {
  const overrides = loadJsonFile(CONFIG_FILE, {});
  res.json({
    ...BIRTHDAY_CONFIG,
    ...overrides,
  });
});

// 2. Public Approved Wishes
app.get('/api/wishes', (_req: Request, res: Response) => {
  const allWishes = loadJsonFile<Array<{
    id: string;
    name: string;
    message: string;
    createdAt: string;
    status: string;
  }>>(WISHES_FILE, []);

  // Public endpoint only returns approved wishes
  const approved = allWishes
    .filter(w => w.status === 'approved')
    .map(({ id, name, message, createdAt }) => ({
      id,
      name,
      message,
      createdAt,
    }));

  res.json({ wishes: approved });
});

// 3. Post a new guest wish
app.post('/api/wishes', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  if (!checkRateLimit(clientIp)) {
    res.status(429).json({ error: 'Too many submissions. Please wait a few minutes before trying again.' });
    return;
  }

  const { name, message } = req.body;
  const validation = validateWish(name, message);

  if (!validation.valid) {
    res.status(400).json({ error: validation.error });
    return;
  }

  const allWishes = loadJsonFile<Array<{
    id: string;
    name: string;
    message: string;
    createdAt: string;
    status: string;
    ipHash?: string;
  }>>(WISHES_FILE, []);

  const newWish = {
    id: `wish-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    name: validation.sanitizedName!,
    message: validation.sanitizedMessage!,
    createdAt: new Date().toISOString(),
    status: 'approved', // Auto-approved by default; admin can moderate / hide anytime
    ipHash: crypto.createHash('sha256').update(clientIp).digest('hex').substring(0, 16),
  };

  allWishes.unshift(newWish);
  saveJsonFile(WISHES_FILE, allWishes);

  res.status(201).json({
    success: true,
    message: 'Birthday wish posted successfully!',
    wish: {
      id: newWish.id,
      name: newWish.name,
      message: newWish.message,
      createdAt: newWish.createdAt,
    },
  });
});

// 4. Authenticate Owner / Admin
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  // Constant-time comparison for security
  const inputBuffer = Buffer.from(password);
  const targetBuffer = Buffer.from(ADMIN_PASSWORD);

  const isValid =
    inputBuffer.length === targetBuffer.length &&
    crypto.timingSafeEqual(inputBuffer, targetBuffer);

  if (!isValid) {
    res.status(401).json({ error: 'Invalid password. Access denied.' });
    return;
  }

  // Generate secure cryptographic session token
  const token = crypto.randomBytes(32).toString('hex');
  const session = {
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  activeSessions.set(token, session);

  res.json({
    success: true,
    token,
    expiresAt: session.expiresAt,
    user: {
      role: 'owner',
      name: 'Lalee Patle Site Owner',
    },
  });
});

// 5. Verify Token Session
app.get('/api/auth/verify', requireAuth, (_req: Request, res: Response) => {
  res.json({ valid: true, role: 'owner' });
});

// 6. Admin: List All Wishes (Pending, Approved, Rejected)
app.get('/api/admin/wishes', requireAuth, (_req: Request, res: Response) => {
  const allWishes = loadJsonFile(WISHES_FILE, []);
  res.json({ wishes: allWishes });
});

// 7. Admin: Update Wish Status (approve / reject)
app.patch('/api/admin/wishes/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  const allWishes = loadJsonFile<Array<{ id: string; status: string }>>(WISHES_FILE, []);
  const wishIndex = allWishes.findIndex(w => w.id === id);

  if (wishIndex === -1) {
    res.status(404).json({ error: 'Wish not found' });
    return;
  }

  allWishes[wishIndex].status = status;
  saveJsonFile(WISHES_FILE, allWishes);

  res.json({ success: true, wish: allWishes[wishIndex] });
});

// 8. Admin: Delete a Wish
app.delete('/api/admin/wishes/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const allWishes = loadJsonFile<Array<{ id: string }>>(WISHES_FILE, []);
  const filtered = allWishes.filter(w => w.id !== id);

  if (filtered.length === allWishes.length) {
    res.status(404).json({ error: 'Wish not found' });
    return;
  }

  saveJsonFile(WISHES_FILE, filtered);
  res.json({ success: true, message: 'Wish deleted' });
});

// 9. Protected Private Memories (SERVER-AUTHENTICATED)
app.get('/api/private/memories', requireAuth, (_req: Request, res: Response) => {
  const memories = loadJsonFile(MEMORIES_FILE, BIRTHDAY_CONFIG.defaultMemories);
  res.json({ memories });
});

// 10. Admin: Add a Private Memory
app.post('/api/private/memories', requireAuth, (req: Request, res: Response) => {
  const { title, date, category, content, tags } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: 'Title and content are required' });
    return;
  }

  const memories = loadJsonFile<Array<any>>(MEMORIES_FILE, []);
  const newMemory = {
    id: `mem-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    title: sanitizeHtml(String(title)),
    date: sanitizeHtml(String(date || 'Special Memory')),
    category: sanitizeHtml(String(category || 'Personal Note')),
    content: sanitizeHtml(String(content)),
    tags: Array.isArray(tags) ? tags.map(t => sanitizeHtml(String(t))) : [],
    createdAt: new Date().toISOString(),
  };

  memories.unshift(newMemory);
  saveJsonFile(MEMORIES_FILE, memories);

  res.status(201).json({ success: true, memory: newMemory });
});

// 11. Admin: Delete Private Memory
app.delete('/api/private/memories/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const memories = loadJsonFile<Array<{ id: string }>>(MEMORIES_FILE, []);
  const filtered = memories.filter(m => m.id !== id);

  if (filtered.length === memories.length) {
    res.status(404).json({ error: 'Memory not found' });
    return;
  }

  saveJsonFile(MEMORIES_FILE, filtered);
  res.json({ success: true, message: 'Memory removed' });
});

// 12. Admin: Update Configuration (Letter, Cards, Details)
app.put('/api/admin/config', requireAuth, (req: Request, res: Response) => {
  const currentOverrides = loadJsonFile(CONFIG_FILE, {});
  const updated = {
    ...currentOverrides,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  saveJsonFile(CONFIG_FILE, updated);
  res.json({ success: true, config: updated });
});

// 13. System Stats
app.get('/api/stats', (_req: Request, res: Response) => {
  const allWishes = loadJsonFile<Array<{ status: string }>>(WISHES_FILE, []);
  const memories = loadJsonFile<Array<any>>(MEMORIES_FILE, []);

  res.json({
    totalWishes: allWishes.length,
    approvedWishes: allWishes.filter(w => w.status === 'approved').length,
    pendingWishes: allWishes.filter(w => w.status === 'pending').length,
    totalMemories: memories.length,
    recipient: BIRTHDAY_CONFIG.recipientName,
    birthdayDate: `${BIRTHDAY_CONFIG.birthDay} November`,
    timezone: BIRTHDAY_CONFIG.timezone,
  });
});

// Vite & Static Asset Handling
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lalee Patle Birthday Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
