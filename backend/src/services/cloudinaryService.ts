import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export interface UploadResult {
  url: string;
  publicId: string;
}

export const uploadToCloudinary = (
  buffer: Buffer,
  folder = 'atlas',
  mimetype = 'image/jpeg'
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith('video')
      ? 'video'
      : mimetype === 'application/pdf'
      ? 'raw'
      : 'image';

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        transformation: resourceType === 'image'
          ? [{ quality: 'auto', fetch_format: 'auto' }]
          : [],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
