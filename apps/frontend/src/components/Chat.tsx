import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { addMessage, type Message } from '../features/chat/chatSlice.ts';
import { type JsonRpcRequest, type JsonRpcSuccessResponse, RpcMethods, socket } from '../socket.ts';
import { ThreeIcon } from './ThreeIcon.tsx';

function isSuccessResponse<T>(obj: unknown): obj is JsonRpcSuccessResponse<T> {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const record = obj as Record<string, unknown>;

  return (
    record.jsonrpc === '2.0' &&
    'result' in record &&
    'id' in record &&
    typeof record.id !== 'undefined'
  );
}

function isChatMessage(obj: unknown): obj is Message {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const record = obj as Record<string, unknown>;

  return (
    typeof record.user === 'string' &&
    typeof record.text === 'string' &&
    typeof record.timestamp === 'string'
  );
}

let messageIdCounter = 1;

export const Chat = () => {
  const dispatch = useDispatch();
  /**
   * 🔐 The currentUserId should normally be obtained from the authentication context or user session.
   * ⚙️ For the sake of this technical task and simplicity, it is hardcoded here.
   */
  const currentUserId = '123';

  useEffect(() => {
    socket.on('rpc', (message: string | object) => {
      try {
        const parsed = typeof message === 'string' ? JSON.parse(message) : message;
        if (isSuccessResponse(parsed) && isChatMessage(parsed.result)) {
          dispatch(addMessage(parsed.result));
        }
      } catch (e) {
        console.error('Invalid JSON-RPC message received:', message, e);
      }
    });

    return () => {
      socket.off('rpc');
    };
  }, [dispatch]);

  const sendMessage = (text: string): void => {

    const rpcRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: messageIdCounter++,
      method: RpcMethods.SendMessage,
      params: { user: currentUserId, text },
    };

    socket.emit('rpc', JSON.stringify(rpcRequest));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30">
      <div className="flex items-center gap-2">
        <ThreeIcon />
        <h1 className="text-3xl font-bold text-center text-blue-700">Chat App</h1>
      </div>

      <ChatMessages userId={currentUserId} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
};
