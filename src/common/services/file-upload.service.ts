import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class FileUploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'blog' },
        (error, result) => {
          if (error) {
            console.log('Cloudinary upload error:', error);
            return reject(new Error('File upload to Cloudinary failed'));
          }
          if (!result || !result.secure_url) {
            return reject(new Error('Upload result does not contain secure_url'));
          }
          resolve(result.secure_url);
        }
      );

      // Convert buffer to readable stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }
}
