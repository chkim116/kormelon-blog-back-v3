import { env } from '@config';
import limit from 'express-rate-limit';

export const rateLimiter = limit({
  windowMs: env.mode === 'production' ? 60 * 1000 : 1_000_000,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  max: env.mode === 'production' ? 5 : 100_000,
  handler(req, res) {
    res.status(400).json({
      status: 400,
      message:
        'Too many accounts created from this IP, please try again after an minute',
    });
  },
});
