import { useAppSelector } from '../hooks';
import type {ChatState, Message} from '../features/chat/chatSlice.ts';


export const ChatMessages = () => {
  const messages: Message[] = useAppSelector((state : { chat: ChatState }) => state.chat.messages);

  return (
    <div className="p-4 max-h-[300px] overflow-y-auto rounded-xl bg-white/70 backdrop-blur-md shadow-inner border border-white/30 mb-4 space-y-3">
      {messages.length === 0 && (
        <p className="text-gray-500 text-center italic">No messages yet</p>
      )}
      {messages.map(msg => (
        <div key={msg.id} className="flex justify-start">
          <div className="bg-blue-100 text-gray-800 px-4 py-2 rounded-xl shadow">
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
};
