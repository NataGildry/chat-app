import { Server, Socket } from 'socket.io';
import { parse, success, error } from 'jsonrpc-lite';
import { ErrorObject, SuccessObject } from 'jsonrpc-lite/jsonrpc';
import logger from './utils/logger';
import { SendMessageParams } from './types';
import { RpcErrorCodes, RpcMethods } from './constants';

function isSendMessageParams(obj: unknown): obj is SendMessageParams {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const record = obj as Record<string, unknown>;

  return (
    typeof record.user === 'string' &&
    typeof record.text === 'string'
  );
}

function handleRpcMessage(io: Server, socket: Socket, message: string): void {
  try {
    const parsed = parse(message);

    if (parsed.type !== 'request') {
      logger.warn({ message }, 'Received non-request JSON-RPC message');
      return;
    }

    const rpc = parsed.payload;
    const { method, params, id } = rpc;

    switch (method) {
      case RpcMethods.SendMessage:
        if (!isSendMessageParams(params)) {
          const errResp: ErrorObject = error(id, {
            code: RpcErrorCodes.InvalidParams,
            message: 'Invalid params: user and text are required',
          });
          socket.emit('rpc', errResp);
          return;
        }

        const result = {
          user: params.user,
          text: params.text,
          timestamp: new Date().toISOString(),
        };

        const successResp: SuccessObject = success(id, result);
        io.emit('rpc', successResp);
        break;

      default:
        const notFoundResp: ErrorObject = error(id, {
          code: RpcErrorCodes.MethodNotFound,
          message: `Method not found: ${method}`,
        });
        socket.emit('rpc', notFoundResp);
        break;
    }
  } catch (err) {
    logger.error({ err, message }, 'JSON-RPC parsing or handling error');
    const parseErrorResp: ErrorObject = error(null, {
      code: RpcErrorCodes.ParseError,
      message: 'Parse error',
    });
    socket.emit('rpc', parseErrorResp);
  }
}

export function registerSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket): void => {
    logger.info({ socketId: socket.id }, 'Client connected');

    socket.on('rpc', (message: string): void => {
      handleRpcMessage(io, socket, message);
    });

    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Client disconnected');
    });
  });
}
