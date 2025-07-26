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

    // Create Telegram gift categories
    const categoryData = [
      { name: "Sticker Packs", slug: "sticker-packs" },
      { name: "Premium Features", slug: "premium-features" },
      { name: "Digital Collectibles", slug: "digital-collectibles" },
      { name: "Gift Cards", slug: "gift-cards" },
      { name: "Custom Themes", slug: "custom-themes" },
      { name: "Telegram Stars", slug: "telegram-stars" },
    ];

    // Get existing categories or create new ones
    let insertedCategories = await db.insert(categories).values(categoryData).onConflictDoNothing().returning();
    if (insertedCategories.length === 0) {
      // Categories already exist, fetch them
      insertedCategories = await db.select().from(categories);
    }
    console.log(`${insertedCategories.length} categories available`);

    // Create Telegram gift products
    const productData = [
      {
        name: "Animated Sticker Pack - Cute Cats",
        description: "Premium animated sticker pack featuring adorable cats with various emotions. Perfect for expressing yourself in chats!",
        price: "2.99",
        imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
        categoryId: insertedCategories[0].id, // Sticker Packs
        sellerId: "demo-seller-1",
        stock: 1000,
        isActive: true,
      },
      {
        name: "Telegram Premium (1 Month)",
        description: "Unlock exclusive features: larger file uploads, custom reactions, advanced chat management, and premium stickers.",
        price: "4.99",
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
        categoryId: insertedCategories[1].id, // Premium Features
        sellerId: "demo-seller-2",
        stock: 500,
        isActive: true,
      },
      {
        name: "Digital Art NFT Collection",
        description: "Exclusive digital collectibles featuring original Telegram-themed artwork. Show off your unique style!",
        price: "12.99",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
        categoryId: insertedCategories[2].id, // Digital Collectibles
        sellerId: "demo-seller-3",
        stock: 100,
        isActive: true,
      },
      {
        name: "Telegram Stars Gift Card - 100 Stars",
        description: "Send the gift of Telegram Stars! Perfect for friends to purchase premium content and features.",
        price: "9.99",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
        categoryId: insertedCategories[3].id, // Gift Cards
        sellerId: "demo-seller-1",
        stock: 250,
        isActive: true,
      },
      {
        name: "Dark Mode Theme Pack",
        description: "Custom dark themes for Telegram with unique color schemes and beautiful gradients. Easy installation included.",
        price: "1.99",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        categoryId: insertedCategories[4].id, // Custom Themes
        sellerId: "demo-seller-2",
        stock: 300,
        isActive: true,
      },
      {
        name: "500 Telegram Stars Bundle",
        description: "Large bundle of Telegram Stars at a discounted price. Use for premium features, stickers, and gifts.",
        price: "39.99",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        categoryId: insertedCategories[5].id, // Telegram Stars
        sellerId: "demo-seller-3",
        stock: 150,
        isActive: true,
      },
      {
        name: "Retro Gaming Sticker Pack",
        description: "Nostalgic sticker pack with pixel art gaming characters and retro gaming references. Great for gaming communities!",
        price: "3.99",
        imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop",
        categoryId: insertedCategories[0].id, // Sticker Packs
        sellerId: "demo-seller-1",
        stock: 400,
        isActive: true,
      },
      {
        name: "Exclusive Username Badge",
        description: "Special collectible badge that displays next to your username. Limited edition design with holographic effects.",
        price: "19.99",
        imageUrl: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=300&fit=crop",
        categoryId: insertedCategories[2].id, // Digital Collectibles
        sellerId: "demo-seller-2",
        stock: 50,
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