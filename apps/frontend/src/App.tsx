import './App.css'
import {ChatMessages, ChatInput, ThreeIcon} from './components';

function App() {
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Chat App</h1>
      <ThreeIcon />
      <ChatMessages />
      <ChatInput />
    </div>
  )
}

export default App
