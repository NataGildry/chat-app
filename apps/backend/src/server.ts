import http from 'http';
import { Server } from 'socket.io';
import { Express } from 'express';
import { createApp } from './app';
import { registerSocketHandlers } from './socket';
import logger from './utils/logger';
import dotenv from 'dotenv';
dotenv.config();

import { corsOptions } from './utils';

const PORT: number = Number(process.env.PORT) || 3001;
const app: Express = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});

registerSocketHandlers(io);

server.listen(PORT, () => {
  logger.info({ event: 'server_start', port: PORT, url: `http://localhost:${PORT}` }, 'Server started');
});
