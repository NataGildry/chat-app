
import { addMessage } from '../features/chat/chatSlice';
import { useState } from 'react';
import { useAppDispatch } from '../hooks';

export const ChatInput = () => {
  const [text, setText] = useState('');
  const dispatch = useAppDispatch();

  const handleSend = () => {
    if (text.trim() === '') return;
    dispatch(addMessage({ id: Date.now(), text }));
    setText('');
  };

  return (
    <div className="flex space-x-2 p-4">
      <input
        type="text"
        className="flex-grow border rounded px-3 py-2"
        value={text}
        onChange={event => setText(event.target.value)}
        placeholder="Type your message..."
        onKeyDown={event => { if (event.key === 'Enter') handleSend(); }}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};
