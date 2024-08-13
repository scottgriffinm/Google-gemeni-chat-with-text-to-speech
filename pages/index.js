import { useState } from 'react';
import { speakText } from '../public/tts';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add the user's message to the chat
    setMessages((prevMessages) => [...prevMessages, { role: 'user', text: input }]);

    // Clear the input field immediately after sending the message
    setInput('');

    // Send the message to the server
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the AI's response to the chat
        setMessages((prevMessages) => [...prevMessages, { role: 'ai', text: data.text }]);
        speakText(data.text);  // Speak the AI's response using Moira's voice
      } else {
        console.error('Error:', data.error);
        const errorMessage = 'Error: Could not get a response.';
        setMessages((prevMessages) => [...prevMessages, { role: 'ai', text: errorMessage }]);
        speakText(errorMessage);  // Speak the error message
      }
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = 'Error: Failed to communicate with the server.';
      setMessages((prevMessages) => [...prevMessages, { role: 'ai', text: errorMessage }]);
      speakText(errorMessage);  // Speak the error message
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Chat with Gemini</h1>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          height: '400px',
          overflowY: 'scroll',
          marginBottom: '10px',
        }}
      >
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: message.role === 'user' ? 'right' : 'left' }}>
            <strong>{message.role === 'user' ? 'You' : 'Gemini'}:</strong>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#0070f3', color: '#fff' }}>
          Send
        </button>
      </form>
    </div>
  );
}
