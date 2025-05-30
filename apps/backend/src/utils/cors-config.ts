import { CorsOptions } from 'cors';

const getCorsOrigins = (): string[] => {
  const origins = process.env.CORS_ORIGIN || 'http://localhost:3000';
  return origins.split(',').map(origin => origin.trim());
};

export const corsOptions: CorsOptions = {
  origin: getCorsOrigins(),
  methods: ['GET', 'POST'],
};
