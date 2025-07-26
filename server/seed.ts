import { db } from "./db";
import { categories, products, users } from "@shared/schema";

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Create demo users first
    const userData = [
      {
        id: "demo-seller-1",
        email: "seller1@example.com",
        firstName: "Alice",
        lastName: "Johnson",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "demo-seller-2", 
        email: "seller2@example.com",
        firstName: "Bob",
        lastName: "Smith",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "demo-seller-3",
        email: "seller3@example.com", 
        firstName: "Carol",
        lastName: "Davis",
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
    ];

    const insertedUsers = await db.insert(users).values(userData).onConflictDoNothing().returning();
    console.log(`Created ${insertedUsers.length} demo users`);

    // Create categories
    const categoryData = [
      { name: "Electronics", slug: "electronics" },
      { name: "Clothing", slug: "clothing" },
      { name: "Home & Garden", slug: "home-garden" },
      { name: "Sports", slug: "sports" },
      { name: "Books", slug: "books" },
      { name: "Toys", slug: "toys" },
    ];

    // Get existing categories or create new ones
    let insertedCategories = await db.insert(categories).values(categoryData).onConflictDoNothing().returning();
    if (insertedCategories.length === 0) {
      // Categories already exist, fetch them
      insertedCategories = await db.select().from(categories);
    }
    console.log(`${insertedCategories.length} categories available`);

    // Create some sample products
    const productData = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        price: "99.99",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        categoryId: insertedCategories[0].id, // Electronics
        sellerId: "demo-seller-1",
        stock: 25,
        isActive: true,
      },
      {
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt available in multiple colors and sizes.",
        price: "19.99",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
        categoryId: insertedCategories[1].id, // Clothing
        sellerId: "demo-seller-2",
        stock: 50,
        isActive: true,
      },
      {
        name: "Smart Phone Stand",
        description: "Adjustable phone stand compatible with all smartphone sizes. Perfect for video calls and streaming.",
        price: "15.99",
        imageUrl: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=300&fit=crop",
        categoryId: insertedCategories[0].id, // Electronics
        sellerId: "demo-seller-1",
        stock: 100,
        isActive: true,
      },
      {
        name: "Ceramic Plant Pot",
        description: "Beautiful handcrafted ceramic pot perfect for indoor plants. Includes drainage hole.",
        price: "24.99",
        imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop",
        categoryId: insertedCategories[2].id, // Home & Garden
        sellerId: "demo-seller-3",
        stock: 30,
        isActive: true,
      },
      {
        name: "Yoga Mat",
        description: "Non-slip exercise mat perfect for yoga, pilates, and home workouts. Eco-friendly material.",
        price: "34.99",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        categoryId: insertedCategories[3].id, // Sports
        sellerId: "demo-seller-2",
        stock: 40,
        isActive: true,
      },
      {
        name: "Programming Book Set",
        description: "Complete set of modern web development books covering React, Node.js, and TypeScript.",
        price: "89.99",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
        categoryId: insertedCategories[4].id, // Books
        sellerId: "demo-seller-1",
        stock: 15,
        isActive: true,
      },
    ];

    const insertedProducts = await db.insert(products).values(productData).onConflictDoNothing().returning();
    console.log(`Created ${insertedProducts.length} new products`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run if called directly
seedDatabase().then(() => process.exit(0));

export { seedDatabase };