import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import crypto from "crypto";

// 1. جلسات PostgreSQL (بقي كما هو مع تعديلات طفيفة)
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

// 2. تحقق من بيانات Telegram
async function verifyTelegramUser(initData: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');

  const secret = crypto.createHmac('sha256', 'WebAppData')
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest();

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const calculatedHash = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  if (calculatedHash !== hash) throw new Error('Invalid hash');

  const user = JSON.parse(params.get('user')!);
  await storage.upsertUser({
    id: user.id.toString(),
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  });
  return user;
}

// 3. إعداد المصادقة الجديدة
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // نقاط النهاية المعدلة
  app.get("/api/login", (req, res) => {
    if (!req.header('Telegram-Init-Data')) {
      return res.status(400).json({ error: 'Telegram auth required' });
    }
    res.json({ status: 'already_authenticated' });
  });

  app.post("/api/callback", async (req, res) => {
    try {
      const user = await verifyTelegramUser(req.body.initData);
      req.login(user, (err) => {
        if (err) throw err;
        res.json({ success: true });
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid Telegram auth' });
    }
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => res.json({ success: true }));
  });
}

// 4. Middleware التعديل
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Telegram authentication required' });
};