import express, { Express } from 'express';
import cors from 'cors';

export function createApp(): Express {
  const app: Express = express();

  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }));

  app.use(express.json());

  app.get('/health', (_req, res): void => {
    res.json({ status: 'ok' });
  });

  return app;
}
