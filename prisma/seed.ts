import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mycat.store" },
    update: {},
    create: {
      name: "MyCat Admin",
      email: "admin@mycat.store",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Test customer
  const customerPassword = await bcrypt.hash("customer123", 12);
  await prisma.user.upsert({
    where: { email: "customer@test.com" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "customer@test.com",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "food-treats" },
      update: {},
      create: {
        name: "Food & Treats",
        slug: "food-treats",
        description: "Premium nutrition and delicious treats for your cat",
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
      },
    }),
    prisma.category.upsert({
      where: { slug: "toys" },
      update: {},
      create: {
        name: "Toys",
        slug: "toys",
        description: "Interactive toys to keep your cat entertained",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "Collars, leashes, carriers, and more",
        image: "https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=400&h=400&fit=crop",
      },
    }),
    prisma.category.upsert({
      where: { slug: "health-care" },
      update: {},
      create: {
        name: "Health Care",
        slug: "health-care",
        description: "Vitamins, supplements, and health products",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
      },
    }),
    prisma.category.upsert({
      where: { slug: "beds" },
      update: {},
      create: {
        name: "Beds & Furniture",
        slug: "beds",
        description: "Cozy beds, cat trees, and scratching posts",
        image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
      },
    }),
    prisma.category.upsert({
      where: { slug: "grooming" },
      update: {},
      create: {
        name: "Grooming",
        slug: "grooming",
        description: "Brushes, shampoos, and grooming essentials",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
      },
    }),
  ]);

  const [food, toys, accessories, health, beds, grooming] = categories;

  // Products
  const products = [
    {
      name: "Premium Salmon & Tuna Cat Food",
      slug: "premium-salmon-tuna-cat-food",
      description: "High-protein cat food made with real salmon and tuna. Packed with omega-3 fatty acids for a healthy coat and strong muscles. No artificial preservatives or fillers.",
      price: 24.99,
      comparePrice: 32.99,
      stock: 150,
      brand: "PurrFect Nutrition",
      categoryId: food.id,
      featured: true,
      tags: ["food", "salmon", "premium", "grain-free"],
      specifications: { weight: "5 lbs", lifestage: "Adult", flavor: "Salmon & Tuna" },
    },
    {
      name: "Interactive Feather Wand Toy",
      slug: "interactive-feather-wand-toy",
      description: "Keep your cat engaged for hours with this premium feather wand toy. The unpredictable movement mimics real prey, triggering your cat's natural hunting instincts.",
      price: 14.99,
      stock: 85,
      brand: "PlayTime Pets",
      categoryId: toys.id,
      featured: true,
      tags: ["toy", "interactive", "feather"],
      specifications: { length: "36 inches", material: "Natural feathers" },
    },
    {
      name: "Orthopedic Memory Foam Cat Bed",
      slug: "orthopedic-memory-foam-cat-bed",
      description: "Give your cat the sleep they deserve with this luxurious orthopedic memory foam bed. Supports joints and provides ultimate comfort for cats of all ages.",
      price: 49.99,
      comparePrice: 69.99,
      stock: 42,
      brand: "DreamCat",
      categoryId: beds.id,
      featured: true,
      tags: ["bed", "memory foam", "orthopedic", "luxury"],
      specifications: { size: '24" x 20"', material: "Memory foam + plush cover" },
    },
    {
      name: "Grain-Free Chicken Treats",
      slug: "grain-free-chicken-treats",
      description: "100% natural chicken treats with no artificial colors, flavors, or preservatives. Perfect for training or rewarding your feline friend.",
      price: 9.99,
      comparePrice: 13.99,
      stock: 200,
      brand: "PurrFect Nutrition",
      categoryId: food.id,
      tags: ["treats", "chicken", "grain-free", "natural"],
      specifications: { weight: "3 oz", ingredients: "Chicken, chicken broth" },
    },
    {
      name: "Adjustable Breakaway Safety Collar",
      slug: "adjustable-breakaway-safety-collar",
      description: "Designed for your cat's safety with a quick-release buckle. Adjustable to fit cats of all sizes. Comes with an ID tag holder.",
      price: 12.99,
      stock: 120,
      brand: "SafePet",
      categoryId: accessories.id,
      tags: ["collar", "safety", "adjustable"],
      specifications: { sizes: "One size fits all", material: "Nylon" },
    },
    {
      name: "Multi-Level Cat Tree Tower",
      slug: "multi-level-cat-tree-tower",
      description: "A luxurious 5-level cat tree with sisal rope scratching posts, cozy perches, and a hanging toy. Perfect for cats who love to climb and explore.",
      price: 89.99,
      comparePrice: 119.99,
      stock: 28,
      brand: "CatKingdom",
      categoryId: beds.id,
      featured: true,
      tags: ["cat tree", "scratching post", "climbing"],
      specifications: { height: "65 inches", weight: "35 lbs", material: "Engineered wood + plush" },
    },
    {
      name: "Omega-3 Vitamin Supplement",
      slug: "omega-3-vitamin-supplement",
      description: "Support your cat's coat, skin, and joint health with our premium omega-3 supplement. Easy-to-administer soft chews that cats love.",
      price: 29.99,
      stock: 75,
      brand: "VitaCat",
      categoryId: health.id,
      tags: ["supplement", "omega-3", "health", "vitamins"],
      specifications: { count: "90 soft chews", dosage: "1 per day" },
    },
    {
      name: "Self-Grooming Brush & Massager",
      slug: "self-grooming-brush-massager",
      description: "Wall-mounted grooming brush that lets cats massage and groom themselves whenever they want. Features soft bristles that are gentle on skin.",
      price: 19.99,
      stock: 60,
      brand: "GroomPro",
      categoryId: grooming.id,
      tags: ["grooming", "brush", "massage"],
      specifications: { size: '7" x 4"', material: "ABS plastic + soft bristles" },
    },
    {
      name: "Automatic Laser Toy",
      slug: "automatic-laser-toy",
      description: "Keep your cat entertained while you're away with this automatic laser toy. Features multiple speed settings and an auto-off timer for safety.",
      price: 34.99,
      comparePrice: 44.99,
      stock: 45,
      brand: "PlayTime Pets",
      categoryId: toys.id,
      featured: true,
      tags: ["toy", "laser", "automatic", "interactive"],
      specifications: { battery: "3x AA", timer: "15/30/60 minutes" },
    },
    {
      name: "Dental Care Water Additive",
      slug: "dental-care-water-additive",
      description: "Simply add to your cat's water bowl to fight plaque and tartar buildup. Tasteless and odorless — cats won't even notice it's there.",
      price: 16.99,
      stock: 90,
      brand: "VitaCat",
      categoryId: health.id,
      tags: ["dental", "health", "water additive"],
      specifications: { volume: "8 fl oz", duration: "30-day supply" },
    },
    {
      name: "Luxury Grooming Kit",
      slug: "luxury-grooming-kit",
      description: "Complete grooming set including a deshedding brush, nail clipper, grooming glove, and cleaning wipes. Everything you need to keep your cat looking their best.",
      price: 39.99,
      comparePrice: 54.99,
      stock: 35,
      brand: "GroomPro",
      categoryId: grooming.id,
      tags: ["grooming", "kit", "brush", "nail clipper"],
      specifications: { contents: "4 pieces", suitable: "All breeds" },
    },
    {
      name: "Stainless Steel Water Fountain",
      slug: "stainless-steel-water-fountain",
      description: "Encourage your cat to drink more with this flowing water fountain. Stainless steel construction is hygienic and easy to clean. Features a quiet pump.",
      price: 44.99,
      stock: 55,
      brand: "CatKingdom",
      categoryId: accessories.id,
      featured: false,
      tags: ["water fountain", "stainless steel", "hydration"],
      specifications: { capacity: "1.5L", noise: "< 30dB", filter: "Included" },
    },
  ];

  for (const productData of products) {
    const { specifications, tags, ...rest } = productData;
    const product = await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        status: "ACTIVE",
        tags,
        specifications,
      },
    });

    // Add placeholder image
    const imageCount = await prisma.productImage.count({ where: { productId: product.id } });
    if (imageCount === 0) {
      const catImages = [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop",
      ];
      const imageUrl = catImages[Math.floor(Math.random() * catImages.length)];
      await prisma.productImage.create({
        data: { url: imageUrl, productId: product.id, order: 0 },
      });
    }
  }

  // Sample coupon
  await prisma.coupon.upsert({
    where: { code: "NEWCAT20" },
    update: {},
    create: {
      code: "NEWCAT20",
      description: "20% off for new customers",
      type: "PERCENTAGE",
      value: 20,
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "SAVE10" },
    update: {},
    create: {
      code: "SAVE10",
      description: "$10 off orders over $50",
      type: "FIXED",
      value: 10,
      minOrderAmount: 50,
      active: true,
    },
  });

  console.log("✅ Seed complete!");
  console.log("📧 Admin: admin@mycat.store / admin123");
  console.log("📧 Customer: customer@test.com / customer123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
