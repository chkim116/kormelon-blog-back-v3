import { json, urlencoded } from 'express';
import type { Express } from 'express';

import routes from '@api';
import { env } from '@config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler, payloadHandler } from '../api/middlewares';
import { rateLimiter } from './limiter';

export async function expressConfig(app: Express) {
  // security
  app.use(helmet());
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'production'
          ? [
              'https://kormelon.com',
              'https://www.kormelon.com',
              'https://kormelon-blog-front-v3.vercel.app',
            ]
          : true,
      credentials: true,
    })
  );

  // logger
  app.use(morgan('dev'));

  // parser
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // routes
  app.use(rateLimiter);
  app.use(env.prefix, routes());
  app.use(payloadHandler);
  app.use(errorHandler);
}
