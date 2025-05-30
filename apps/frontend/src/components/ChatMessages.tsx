import { useAppSelector } from '../hooks';
import type {ChatState, Message} from '../features/chat/chatSlice.ts';


export const ChatMessages = () => {
  const messages: Message[] = useAppSelector((state : { chat: ChatState }) => state.chat.messages);

  return (
    <div className="p-4 max-h-[300px] overflow-y-auto border rounded">
      { messages.length === 0 && <p className="text-gray-500">No messages yet</p> }
      { messages.map(msg => (
        <div key={ msg.id } className="mb-2">
          <div className="bg-gray-100 p-2 rounded">{ msg.text }</div>
        </div>
      )) }
    </div>
  );
};
