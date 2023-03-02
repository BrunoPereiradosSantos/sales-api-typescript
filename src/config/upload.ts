import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');
const tmpFolder = path.resolve(__dirname, '..', '..', 'temp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  directory: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  directory: uploadFolder,
  tmpFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(64).toString('hex');

        const fileName = `${fileHash}-${path.extname(file.originalname)}`;
        callback(null, fileName);
      },
    }),
  },
  config: {
    aws: {
      bucket: 'sales-api',
    },
  },
} as IUploadConfig;
