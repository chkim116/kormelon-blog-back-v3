import { json, urlencoded } from 'express';
import type { Express } from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

export async function expressConfig(app: Express) {
  // security
  app.use(helmet());
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'production' ? 'https://kormelon.com' : true,
      credentials: true,
    })
  );

  // logger
  app.use(morgan('dev'));

  // parser
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));
}
