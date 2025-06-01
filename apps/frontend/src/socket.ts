import { io } from 'socket.io-client';

export type JsonRpcRequest = {
  jsonrpc: '2.0';
  id: number | string | null;
  method: string;
  params?: unknown;
};

export type JsonRpcSuccessResponse<T = unknown> = {
  jsonrpc: '2.0';
  id: number | string | null;
  result: T;
};

export const RpcMethods = {
  SendMessage: 'sendMessage',
};

export const socket = io('http://localhost:3001');
