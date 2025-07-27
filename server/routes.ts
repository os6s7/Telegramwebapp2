import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupTelegramAuth, isAuthenticated } from "./telegramAuth"; // تم تغيير هذا
import { insertProductSchema, insertCategorySchema, insertCartItemSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Telegram Auth middleware - تم تغيير هذا
  await setupTelegramAuth(app);

  // Auth routes - تم تعديلها لتعمل مع Telegram
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id; // Telegram user id
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // بقية الرواتب تبقى كما هي مع تعديلات بسيطة
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(400).json({ message: "Failed to create category" });
    }
  });

  // ... (بقية الرواتب تبقى كما هي)

  const httpServer = createServer(app);
  return httpServer;
}