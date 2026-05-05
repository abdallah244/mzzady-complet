/**
 * Script to download real product images and update auctions
 * Run: npx ts-node src/seed-images.ts
 */
import mongoose from 'mongoose';

const MONGO_URI =
  'mongodb+srv://abdallahhfares_db_user:87p3y73Sa3w2splG@mazzady.tedodg0.mongodb.net/projectdata?appName=mazzady';

// Real product images from Unsplash (free to use)
const auctionImages: Record<string, string> = {
  'iPhone 15 Pro Max 256GB':
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
  'Samsung Galaxy S24 Ultra':
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
  'ساعة رولكس أوريجينال كلاسيك':
    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
  'شنطة لويس فيتون أصلية':
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
  'طقم أنتريه مودرن 7 قطع':
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'تلفزيون سامسونج 75 بوصة QLED':
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
  'BMW X5 موديل 2023':
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  'تويوتا كورولا 2024 زيرو':
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
  'لوحة زيتية أصلية - فنان مصري':
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  'خاتم ألماس 2 قيراط':
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  'عقد ذهب عيار 21 - 50 جرام':
    'https://images.unsplash.com/photo-1515562141589-67f0d569b6c9?w=800&q=80',
  'مجموعة كتب نادرة - طبعة أولى':
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
  'جهاز جري كهربائي احترافي':
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80',
  'دراجة هوائية Trek Madone':
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
  'بيانو ياماها ديجيتال P-125':
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80',
};

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await response.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), contentType };
}

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  const db = mongoose.connection.db!;
  const auctionsCol = db.collection('auctions');
  const imageStoreCol = db.collection('imagestores');

  const auctionNames = Object.keys(auctionImages);

  for (const name of auctionNames) {
    const auction = await auctionsCol.findOne({ productName: name });
    if (!auction) {
      console.log(`⚠ Auction not found: ${name}`);
      continue;
    }

    const url = auctionImages[name];
    console.log(`Downloading image for: ${name}...`);

    try {
      const { buffer, contentType } = await downloadImage(url);
      console.log(`  Downloaded ${(buffer.length / 1024).toFixed(0)}KB`);

      // Store in ImageStore
      const imgDoc = await imageStoreCol.insertOne({
        contentType,
        data: buffer,
        originalName: `${name.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const imageUrl = `/images/${imgDoc.insertedId.toString()}`;

      // Update auction
      await auctionsCol.updateOne(
        { _id: auction._id },
        { $set: { mainImageUrl: imageUrl, mainImageFilename: `${name}.jpg` } },
      );

      console.log(`  ✓ Stored & updated: ${imageUrl}`);
    } catch (err) {
      console.error(`  ✗ Failed for ${name}:`, (err as Error).message);
    }
  }

  console.log('\nDone! All auction images updated.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
