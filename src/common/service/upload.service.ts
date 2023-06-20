import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as admin from 'firebase-admin';

@Injectable()
export class UploadService {
  constructor() {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const storage = admin.storage();
    const bucket = storage.bucket();

    const fileExtension = path.extname(file.originalname);
    const filePath = file.originalname;

    const params = {
      Body: file.buffer,
      Bucket: process.env.CLOUD_S3_BUCKET,
      Key: filePath,
    };

    const uniqueFilename = `${filePath}`;
    const fileUpload = bucket.file(uniqueFilename);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => reject(error));
      stream.on('finish', () => {
        fileUpload.getSignedUrl(
          {
            action: 'read',
            expires: '03-01-2500',
          },
          (error, signedUrl) => {
            if (error) {
              reject(error);
            } else {
              resolve(signedUrl);
            }
          },
        );
      });
      stream.end(file.buffer);
    });
  }
}
