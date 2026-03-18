import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin@OFH2026', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ofh.com' },
    update: {},
    create: {
      email: 'admin@ofh.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create test user
  const userPassword = await bcrypt.hash('user@OFH2026', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@ofh.com' },
    update: {},
    create: {
      email: 'user@ofh.com',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: Role.USER,
    },
  });
  console.log(`✅ Test user created: ${testUser.email}`);

  // Keep storefront categories aligned with src/data/products.ts
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'jaggery' },
      update: {},
      create: {
        name: 'Jaggery',
        slug: 'jaggery',
        description: 'Natural jaggery products',
        image: '/assets/category-jaggery.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'rice' },
      update: {},
      create: {
        name: 'Rice',
        slug: 'rice',
        description: 'Premium organic rice',
        image: '/assets/category-rice.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'vegetables' },
      update: {},
      create: {
        name: 'Vegetables',
        slug: 'vegetables',
        description: 'Fresh organic vegetables',
        image: '/assets/category-vegetables.jpg',
      },
    }),
  ]);
  console.log(`✅ ${categories.length} categories created`);

  // Create products with inventory using existing storefront values
  const products = [
    {
      name: 'Organic Jaggery',
      slug: 'organic-jaggery',
      description:
        'Pure organic jaggery made from naturally grown sugarcane, processed without chemicals. Rich in iron and minerals, this traditional sweetener is a healthy alternative to refined sugar. Perfect for sweets, tea, and everyday cooking.',
      details: [
        '100% Organic & Chemical-free',
        'Rich in Iron & Minerals',
        'Traditional stone-crushed process',
        'No artificial additives or preservatives',
        'Sourced from certified organic farms',
      ],
      price: 149,
      unit: '500g',
      images: ['/assets/product-jaggery.jpg'],
      categorySlug: 'jaggery',
      stock: 50,
      isNew: true,
    },
    {
      name: 'Organic Rice',
      slug: 'organic-rice',
      description:
        'Premium organic rice grown without pesticides or chemical fertilizers. Hand-harvested and sun-dried for authentic taste and aroma. Each grain is long, fluffy, and packed with natural goodness.',
      details: [
        'Certified Organic',
        'Pesticide-free cultivation',
        'Sun-dried for natural aroma',
        'Long grain, fluffy texture',
        'Sourced from traditional paddy farms',
      ],
      price: 199,
      unit: '1 kg',
      images: ['/assets/product-organic-rice.jpg'],
      categorySlug: 'rice',
      stock: 40,
      isNew: true,
    },
    {
      name: 'Organic Jaggery Syrup',
      slug: 'organic-jaggery-syrup',
      description:
        'Pure organic jaggery syrup, a liquid gold sweetener made from concentrated sugarcane juice. Perfect for drizzling over pancakes, desserts, or using as a natural sweetener in beverages. No added colors or preservatives.',
      details: [
        '100% Pure Jaggery Extract',
        'No artificial colors or flavors',
        'Natural liquid sweetener',
        'Rich in iron and calcium',
        'Glass bottle packaging',
      ],
      price: 249,
      unit: '500ml',
      images: ['/assets/product-jaggery-syrup.jpg'],
      categorySlug: 'jaggery',
      stock: 30,
      isNew: true,
    },
    {
      name: 'Organic Jaggery Powder',
      slug: 'organic-jaggery-powder',
      description:
        'Finely ground organic jaggery powder, easy to dissolve and use in cooking and baking. Made from premium quality sugarcane jaggery, this powder retains all the natural minerals and nutrients.',
      details: [
        'Finely ground for easy use',
        'Dissolves quickly in liquids',
        'Retains natural minerals',
        'Perfect for baking & cooking',
        'Chemical-free processing',
      ],
      price: 179,
      unit: '500g',
      images: ['/assets/product-jaggery-powder.jpg'],
      categorySlug: 'jaggery',
      stock: 45,
      isNew: false,
    },
    {
      name: 'Organic Tomatoes',
      slug: 'organic-tomatoes',
      description:
        'Fresh organic tomatoes, vine-ripened and bursting with natural flavor. Grown without pesticides on certified organic farms. Rich in lycopene, vitamin C, and antioxidants. Perfect for curries, salads, and chutneys.',
      details: [
        'Vine-ripened for best flavor',
        'Pesticide-free cultivation',
        'Rich in lycopene & vitamin C',
        'Farm-fresh, harvested daily',
        'Ideal for cooking & salads',
      ],
      price: 49,
      unit: '500g',
      images: ['/assets/product-tomatoes.jpg'],
      categorySlug: 'vegetables',
      stock: 60,
      isNew: false,
    },
    {
      name: 'Organic Okra (Bhindi)',
      slug: 'organic-okra-bhindi',
      description:
        'Tender organic okra, freshly harvested from chemical-free farms. These young, crisp ladyfingers are perfect for making bhindi masala, kurkuri bhindi, or adding to sambhar. Rich in dietary fiber and vitamins.',
      details: [
        'Young & tender pods',
        'Chemical-free cultivation',
        'Rich in dietary fiber',
        'Harvested fresh daily',
        'Perfect for Indian cooking',
      ],
      price: 59,
      unit: '500g',
      images: ['/assets/product-okra.jpg'],
      categorySlug: 'vegetables',
      stock: 35,
      isNew: false,
    },
    {
      name: 'Organic Brinjal (Eggplant)',
      slug: 'organic-brinjal-eggplant',
      description:
        'Fresh organic brinjal, deep purple and firm with a rich, earthy flavor. Grown organically without chemical pesticides. Versatile vegetable perfect for baingan bharta, stuffed brinjal, or grilled dishes.',
      details: [
        'Deep purple, firm texture',
        'Organically grown',
        'Rich earthy flavor',
        'Versatile for many recipes',
        'No chemical pesticides used',
      ],
      price: 45,
      unit: '500g',
      images: ['/assets/product-brinjal.jpg'],
      categorySlug: 'vegetables',
      stock: 40,
      isNew: false,
    },
    {
      name: 'Organic Drumstick (Moringa)',
      slug: 'organic-drumstick-moringa',
      description:
        'Fresh organic drumstick pods, also known as moringa, packed with incredible nutrition. These tender pods are a staple in South Indian cooking, perfect for sambhar, curries, and soups. Known as a superfood for its high nutrient content.',
      details: [
        'Superfood with high nutrients',
        'Rich in calcium & vitamins',
        'Organically cultivated',
        'Perfect for sambhar & curries',
        'Fresh & tender pods',
      ],
      price: 69,
      unit: '250g',
      images: ['/assets/product-drumstick.jpg'],
      categorySlug: 'vegetables',
      stock: 25,
      isNew: false,
    },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug);
    if (!category) continue;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        details: p.details || [],
        price: p.price,
        unit: p.unit,
        images: p.images,
        isNew: p.isNew || false,
        categoryId: category.id,
      },
    });

    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        stock: p.stock,
        lowStockThreshold: 10,
      },
    });
  }
  console.log(`✅ ${products.length} products created with inventory`);

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

