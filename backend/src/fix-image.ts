import mongoose from 'mongoose';
async function fix() {
  await mongoose.connect(
    'mongodb+srv://abdallahhfares_db_user:8S91uaf1cBXTz77w@mazzady2.ju9to2m.mongodb.net/projectdata?appName=mazzady2',
  );
  const db = mongoose.connection.db!;
  const res = await fetch(
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' },
  );
  if (!res.ok) throw new Error('Failed: ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log('Downloaded', (buf.length / 1024).toFixed(0) + 'KB');
  const img = await db.collection('imagestores').insertOne({
    contentType: 'image/jpeg',
    data: buf,
    originalName: 'gold_necklace.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const url = '/images/' + img.insertedId.toString();
  await db
    .collection('auctions')
    .updateOne(
      { productName: 'عقد ذهب عيار 21 - 50 جرام' },
      { $set: { mainImageUrl: url, mainImageFilename: 'gold_necklace.jpg' } },
    );
  console.log('Fixed:', url);
  await mongoose.disconnect();
}
fix().catch((e) => {
  console.error(e);
  process.exit(1);
});
