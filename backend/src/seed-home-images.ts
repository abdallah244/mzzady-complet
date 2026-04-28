/**
 * Seed homepage images: hero carousel + howItWorks section
 * Run: npx ts-node src/seed-home-images.ts
 */
import mongoose from 'mongoose';

const MONGO_URI =
  'mongodb+srv://abdallahhfares_db_user:WApo4Tw3H8Ls0tJ6@mazzady3.iorvzi8.mongodb.net/projectdata?appName=mazzady3';

// Hero carousel images — auction/marketplace themed
const heroImages = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=2560&q=100', // online shopping
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2560&q=100', // business dashboard
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=2560&q=100', // e-commerce
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=2560&q=100', // shopping bags
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2560&q=100', // store front
];

// How it works section images
const howItWorksImages = [
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=100', // registration/form
  'https://images.unsplash.com/photo-1553729459-uj8efhgf0r7lj?w=1600&q=100', // bidding concept (fallback below)
];

// About section images
const aboutImages = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=100', // team working
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=100', // business meeting
];

// Fallback URLs in case any fail
const howItWorksFallbacks = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=100', // analytics dashboard
  'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=1600&q=100', // mobile payment
];

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!\n');

  const db = mongoose.connection.db!;
  const imageStoreCol = db.collection('imagestores');
  const homeImageCol = db.collection('homeimages');

  // Clear existing homepage images
  await homeImageCol.deleteMany({});
  console.log('Cleared existing home images.\n');

  // ── HERO IMAGES ──
  console.log('=== Seeding Hero Images ===');
  let heroOrder = 0;
  for (const url of heroImages) {
    process.stdout.write(`  Downloading hero ${heroOrder + 1}...`);
    const buf = await downloadImage(url);
    if (!buf) {
      console.log(' FAILED, skipping');
      continue;
    }
    console.log(` ${Math.round(buf.length / 1024)}KB`);

    // Store in ImageStore
    const result = await imageStoreCol.insertOne({
      data: new mongoose.Types.Buffer(buf) as any,
      contentType: 'image/jpeg',
      filename: `hero-${heroOrder}.jpg`,
      createdAt: new Date(),
    });

    const imageUrl = `/images/${result.insertedId}`;

    // Create HomeImage document
    await homeImageCol.insertOne({
      url: imageUrl,
      section: 'hero',
      filename: `hero-${heroOrder}.jpg`,
      originalName: `hero-${heroOrder}.jpg`,
      mimetype: 'image/jpeg',
      size: buf.length,
      order: heroOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`  ✓ Hero ${heroOrder + 1}: ${imageUrl}`);
    heroOrder++;
  }

  // ── HOW IT WORKS IMAGES ──
  console.log('\n=== Seeding How It Works Images ===');
  const allHowItWorks = [...howItWorksImages, ...howItWorksFallbacks];
  let howOrder = 0;
  const needed = 2;

  for (const url of allHowItWorks) {
    if (howOrder >= needed) break;
    process.stdout.write(`  Downloading howItWorks ${howOrder + 1}...`);
    const buf = await downloadImage(url);
    if (!buf) {
      console.log(' FAILED, trying next');
      continue;
    }
    console.log(` ${Math.round(buf.length / 1024)}KB`);

    const result = await imageStoreCol.insertOne({
      data: new mongoose.Types.Buffer(buf) as any,
      contentType: 'image/jpeg',
      filename: `howItWorks-${howOrder}.jpg`,
      createdAt: new Date(),
    });

    const imageUrl = `/images/${result.insertedId}`;

    await homeImageCol.insertOne({
      url: imageUrl,
      section: 'howItWorks',
      filename: `howItWorks-${howOrder}.jpg`,
      originalName: `howItWorks-${howOrder}.jpg`,
      mimetype: 'image/jpeg',
      size: buf.length,
      order: howOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`  ✓ HowItWorks ${howOrder + 1}: ${imageUrl}`);
    howOrder++;
  }

  // ── ABOUT IMAGES ──
  console.log('\n=== Seeding About Images ===');
  let aboutOrder = 0;
  for (const url of aboutImages) {
    if (aboutOrder >= 2) break;
    process.stdout.write(`  Downloading about ${aboutOrder + 1}...`);
    const buf = await downloadImage(url);
    if (!buf) {
      console.log(' FAILED, trying next');
      continue;
    }
    console.log(` ${Math.round(buf.length / 1024)}KB`);

    const result = await imageStoreCol.insertOne({
      data: new mongoose.Types.Buffer(buf) as any,
      contentType: 'image/jpeg',
      filename: `about-${aboutOrder}.jpg`,
      createdAt: new Date(),
    });

    const imageUrl = `/images/${result.insertedId}`;

    await homeImageCol.insertOne({
      url: imageUrl,
      section: 'about',
      filename: `about-${aboutOrder}.jpg`,
      originalName: `about-${aboutOrder}.jpg`,
      mimetype: 'image/jpeg',
      size: buf.length,
      order: aboutOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`  ✓ About ${aboutOrder + 1}: ${imageUrl}`);
    aboutOrder++;
  }

  console.log(
    `\nDone! Hero: ${heroOrder} images, HowItWorks: ${howOrder} images, About: ${aboutOrder} images`,
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
