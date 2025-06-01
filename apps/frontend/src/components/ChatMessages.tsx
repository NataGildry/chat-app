import { useAppSelector } from '../hooks';
import type { ChatState, Message } from '../features/chat/chatSlice.ts';

type ChatMessagesProps = {
  userId: string;
};

export const ChatMessages = ({ userId }: ChatMessagesProps) => {
  const messages: Message[] = useAppSelector((state : { chat: ChatState }) => state.chat.messages);

  return (
    <div className="p-4 max-h-[300px] overflow-y-auto rounded-xl bg-white/70 backdrop-blur-md shadow-inner border border-white/30 mb-4 space-y-3">
      {messages.length === 0 && (
        <p className="text-gray-500 text-center italic">No messages yet</p>
      )}
      {messages.map((msg: Message, index: number) => {
        const isCurrentUser = msg.user === userId;

        return (
          <div
            key={msg.id ?? index}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-xl shadow
          ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};
