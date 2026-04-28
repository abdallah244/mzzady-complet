import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dqn4u8nrr',
  api_key: '245815578484572',
  api_secret: '3UKhzhyVLgJybgU1qUQ5aTJYl9I',
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mazzady',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
  } as any,
});
