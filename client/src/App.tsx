import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = {
  sender: string;
  text: string;
  timestamp: string;
};

type User = {
  id: string;
  username: string;
};

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUser, setTypingUser] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to the server
    socketRef.current = io('https://supreme-space-memory-4j67jq44jw7xf7gwx-3000.app.github.dev');

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('userList', (userList: User[]) => {
      setUsers(userList);
    });

    socketRef.current.on('typing', (username: string) => {
      setTypingUser(username);
      const timer = setTimeout(() => setTypingUser(''), 2000);
      return () => clearTimeout(timer);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleJoin = () => {
    if (username.trim() && socketRef.current) {
      socketRef.current.emit('join', username);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && socketRef.current) {
      socketRef.current.emit('message', message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    } else if (socketRef.current) {
      socketRef.current.emit('typing');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Real-Time Chat</h1>
      
      {!isConnected && (
        <div className="bg-yellow-100 p-2 rounded mb-4">
          Connecting to server...
        </div>
      )}

      {users.length === 0 ? (
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="font-bold mb-2">Online Users ({users.length})</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {users.map((user) => (
                <span key={user.id} className="bg-gray-200 px-2 py-1 rounded">
                  {user.username}
                </span>
              ))}
            </div>
          </div>

          <div className="border rounded p-4 mb-4 h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-bold">{msg.sender}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p>{msg.text}</p>
              </div>
            ))}
            {typingUser && (
              <div className="text-gray-500 italic">
                {typingUser} is typing...
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="border p-2 flex-grow"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;