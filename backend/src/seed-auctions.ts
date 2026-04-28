/**
 * Seed script: Creates test sellers and 15 real auctions
 * Run: npx ts-node src/seed-auctions.ts
 */
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGO_URI =
  'mongodb+srv://abdallahhfares_db_user:WApo4Tw3H8Ls0tJ6@mazzady3.iorvzi8.mongodb.net/projectdata?appName=mazzady3';

// 15 auctions across 9 categories, durations 1 week → 3 months
const auctionData = [
  // electronics (2)
  {
    productName: 'iPhone 15 Pro Max 256GB',
    startingPrice: 25000,
    minBidIncrement: 500,
    category: 'electronics',
    durationDays: 14,
  },
  {
    productName: 'Samsung Galaxy S24 Ultra',
    startingPrice: 20000,
    minBidIncrement: 500,
    category: 'electronics',
    durationDays: 21,
  },
  // fashion (2)
  {
    productName: 'ساعة رولكس أوريجينال كلاسيك',
    startingPrice: 150000,
    minBidIncrement: 5000,
    category: 'fashion',
    durationDays: 30,
  },
  {
    productName: 'شنطة لويس فيتون أصلية',
    startingPrice: 35000,
    minBidIncrement: 1000,
    category: 'fashion',
    durationDays: 10,
  },
  // home (2)
  {
    productName: 'طقم أنتريه مودرن 7 قطع',
    startingPrice: 15000,
    minBidIncrement: 500,
    category: 'home',
    durationDays: 45,
  },
  {
    productName: 'تلفزيون سامسونج 75 بوصة QLED',
    startingPrice: 30000,
    minBidIncrement: 1000,
    category: 'home',
    durationDays: 7,
  },
  // vehicles (2)
  {
    productName: 'BMW X5 موديل 2023',
    startingPrice: 2500000,
    minBidIncrement: 50000,
    category: 'vehicles',
    durationDays: 60,
  },
  {
    productName: 'تويوتا كورولا 2024 زيرو',
    startingPrice: 900000,
    minBidIncrement: 10000,
    category: 'vehicles',
    durationDays: 90,
  },
  // art (1)
  {
    productName: 'لوحة زيتية أصلية - فنان مصري',
    startingPrice: 5000,
    minBidIncrement: 200,
    category: 'art',
    durationDays: 30,
  },
  // jewelry (2)
  {
    productName: 'خاتم ألماس 2 قيراط',
    startingPrice: 80000,
    minBidIncrement: 2000,
    category: 'jewelry',
    durationDays: 21,
  },
  {
    productName: 'عقد ذهب عيار 21 - 50 جرام',
    startingPrice: 120000,
    minBidIncrement: 5000,
    category: 'jewelry',
    durationDays: 14,
  },
  // books (1)
  {
    productName: 'مجموعة كتب نادرة - طبعة أولى',
    startingPrice: 3000,
    minBidIncrement: 100,
    category: 'books',
    durationDays: 45,
  },
  // sports (2)
  {
    productName: 'جهاز جري كهربائي احترافي',
    startingPrice: 8000,
    minBidIncrement: 500,
    category: 'sports',
    durationDays: 10,
  },
  {
    productName: 'دراجة هوائية Trek Madone',
    startingPrice: 45000,
    minBidIncrement: 1000,
    category: 'sports',
    durationDays: 30,
  },
  // other (1)
  {
    productName: 'بيانو ياماها ديجيتال P-125',
    startingPrice: 18000,
    minBidIncrement: 500,
    category: 'other',
    durationDays: 60,
  },
];

// Placeholder image — a simple 1x1 pixel transparent PNG as base64
const PLACEHOLDER_IMAGE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==',
  'base64',
);

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  const db = mongoose.connection.db!;
  const usersCol = db.collection('users');
  const auctionsCol = db.collection('auctions');
  const imageStoreCol = db.collection('imagestores');

  // --- Step 1: Create placeholder image in ImageStore ---
  const imgDoc = await imageStoreCol.insertOne({
    contentType: 'image/png',
    data: PLACEHOLDER_IMAGE,
    originalName: 'placeholder.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const placeholderUrl = `/images/${imgDoc.insertedId.toString()}`;
  console.log(`Placeholder image stored: ${placeholderUrl}`);

  // --- Step 2: Create test seller accounts ---
  const sellers: { id: mongoose.Types.ObjectId; email: string }[] = [];
  const hashedPassword = await bcrypt.hash('Test@12345', 10);

  for (let i = 1; i <= 5; i++) {
    const email = `seller${i}.test@mazzady.works`;
    const existing = await usersCol.findOne({ email });
    if (existing) {
      sellers.push({ id: existing._id as mongoose.Types.ObjectId, email });
      console.log(`Seller exists: ${email}`);
      continue;
    }

    const result = await usersCol.insertOne({
      email,
      password: hashedPassword,
      firstName: `Seller`,
      middleName: '',
      lastName: `Test${i}`,
      nickname: `seller_test_${i}`,
      authProvider: 'local',
      isProfileComplete: true,
      walletBalance: 5000,
      isOnline: false,
      visitsThisMonth: 0,
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    sellers.push({
      id: result.insertedId as unknown as mongoose.Types.ObjectId,
      email,
    });
    console.log(`Created seller: ${email}`);
  }

  // --- Step 3: Create 15 auctions ---
  const now = new Date();
  let created = 0;

  for (let i = 0; i < auctionData.length; i++) {
    const a = auctionData[i];
    const seller = sellers[i % sellers.length];
    const durationInSeconds = a.durationDays * 24 * 60 * 60;
    const startDate = now;
    const endDate = new Date(now.getTime() + durationInSeconds * 1000);

    // Check if auction with same name already exists to avoid duplicates
    const exists = await auctionsCol.findOne({ productName: a.productName });
    if (exists) {
      console.log(`Auction exists: ${a.productName}`);
      continue;
    }

    await auctionsCol.insertOne({
      productName: a.productName,
      sellerId: seller.id,
      startingPrice: a.startingPrice,
      minBidIncrement: a.minBidIncrement,
      mainImageUrl: placeholderUrl,
      mainImageFilename: 'placeholder.png',
      additionalImagesUrl: [],
      additionalImagesFilename: [],
      status: 'active',
      startDate,
      endDate,
      durationInSeconds,
      highestBid: null,
      highestBidderId: null,
      isFeatured: i < 4, // First 4 are featured
      category: a.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    created++;
    console.log(
      `Created auction: ${a.productName} (${a.category}, ${a.durationDays} days)`,
    );
  }

  console.log(
    `\nDone! Created ${created} auctions, ${sellers.length} sellers.`,
  );
  console.log('Seller password: Test@12345');
  console.log('Sellers:', sellers.map((s) => s.email).join(', '));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
