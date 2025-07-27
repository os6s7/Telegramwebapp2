import {
  users,
  categories,
  products,
  cartItems,
  orders,
  orderItems,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (محدث ليدعم Telegram)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  
  // باقي العمليات تبقى كما هي
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  getProducts(categoryId?: string, searchQuery?: string): Promise<(Product & { seller: User | null })[]>;
  // ... (كل الوظائف الأخرى تبقى كما هي)
}

export class DatabaseStorage implements IStorage {
  // عمليات المستخدم المعدلة
  async getUser(id: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
      where: eq(users.id, telegramId),
    });
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          photoUrl: userData.photoUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // دالة مساعدة جديدة لإنشاء/تحديث مستخدم Telegram
  async upsertTelegramUser(userData: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    isPremium?: boolean;
  }): Promise<User> {
    return this.upsertUser({
      id: userData.id,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      photoUrl: userData.photoUrl,
      isPremium: userData.isPremium,
    });
  }

  // باقي الوظائف تبقى كما هي بدون تغيير
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // ... (جميع الوظائف الأخرى تبقى نفسها)

  // مثال على إحدى الوظائف بدون تعديل
  async getProducts(categoryId?: string, searchQuery?: string): Promise<(Product & { seller: User | null })[]> {
    let query = db
      .select({
        product: products,
        seller: users,
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(eq(products.isActive, true));

    if (categoryId) {
      query = query.where(eq(products.categoryId, categoryId));
    }

    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`;
      query = query.where(
        sql`${products.name} ILIKE ${searchPattern} OR ${products.description} ILIKE ${searchPattern}`
      );
    }

    const results = await query.orderBy(desc(products.createdAt));
    return results.map(({ product, seller }) => ({ ...product, seller }));
  }

  // ... (استمرار جميع الوظائف الأخرى كما هي)
}

export const storage = new DatabaseStorage();