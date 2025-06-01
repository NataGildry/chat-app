import { useState } from 'react';

type ChatInputProps = {
  onSend: (message: string) => void;
};

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [text, setText] = useState('');

  const handleSend = (): void => {
    if (text.trim() === '') return;

    onSend(text);
    setText('');
  };

  return (
    <div className="flex space-x-3 p-4 border-t border-white/20 bg-white/50 backdrop-blur-md rounded-b-2xl">
      <input
        type="text"
        className="flex-grow px-4 py-2 rounded-full bg-white/80 text-gray-800 shadow-inner placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Type your message..."
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleSend();
        }}
      />
      <button
        className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all cursor-pointer"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};
