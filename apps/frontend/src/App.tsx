import './App.css'
import {ChatMessages, ChatInput, ThreeIcon} from './components';

function App() {
  return (
    <div className="max-w-xl mx-auto mt-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30">
      <div className="flex items-center gap-2">
        <ThreeIcon />
        <h1 className="text-3xl font-bold text-center text-blue-700"> Chat App</h1>
      </div>
      <ChatMessages />
      <ChatInput />
    </div>
  )
}

export default App
