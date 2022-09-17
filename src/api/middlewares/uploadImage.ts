import { S3Client } from '@aws-sdk/client-s3';
import { env } from '@config';
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3 = new S3Client({
  credentials: {
    secretAccessKey: env.secretAccessKey || '',
    accessKeyId: env.accessKeyId || '',
  },
  region: 'ap-northeast-2',
});

const upload = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'assets-kormelon-v2/img',
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: 2_000_000 },
});

export const uploadImage = upload.single('image');
