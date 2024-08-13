import { useEffect, useState, useRef } from 'react';
import { speakText } from '../public/tts';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isRecognitionActive = useRef(true); // Flag to control whether recognition should be processed

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = false;

    recognitionRef.current.addEventListener('result', handleSpeechResult);
    recognitionRef.current.addEventListener('end', handleRecognitionEnd);

    return () => {
      recognitionRef.current.removeEventListener('result', handleSpeechResult);
      recognitionRef.current.removeEventListener('end', handleRecognitionEnd);
      recognitionRef.current.abort(); // Fully stop recognition on unmount
    };
  }, []);

  useEffect(() => {
    if (isUserTurn) {
      isRecognitionActive.current = true; // Enable recognition processing
      startSpeechRecognition();
    } else {
      isRecognitionActive.current = false; // Disable recognition processing
      stopSpeechRecognition();
    }
  }, [isUserTurn]);

  const startSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort(); // Fully stop recognition
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const handleSpeechResult = (e) => {
    if (!isUserTurn || !isRecognitionActive.current) return; // Ignore any speech input if recognition is disabled

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');

    if (e.results[0].isFinal) {
      handleUserMessage(transcript);
    } else {
      silenceTimerRef.current = setTimeout(() => {
        stopSpeechRecognition();
        handleUserMessage(transcript);
      }, 5000); // Wait 5 seconds of silence before ending user turn
    }
  };

  const handleRecognitionEnd = () => {
    if (isUserTurn && isRecognitionActive.current) {
      startSpeechRecognition(); // Restart recognition if it's still the user's turn and recognition is enabled
    }
  };

  const handleUserMessage = async (message) => {
    if (!message.trim()) {
      setIsUserTurn(true); // Resume user's turn if message is empty
      return;
    }

    if (!isRecognitionActive.current) return; // Ensure message processing stops if recognition is disabled

    setMessages((prevMessages) => [...prevMessages, { role: 'user', text: message }]);
    setIsUserTurn(false);  // Switch to Gemini's turn

    stopSpeechRecognition(); // Ensure recognition is fully stopped

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prevMessages) => [...prevMessages, { role: 'ai', text: data.text }]);
        speakText(data.text, () => {
          // Switch back to user turn after TTS finishes
          setIsUserTurn(true);
        });
      } else {
        handleError('Error: Could not get a response.');
      }
    } catch (error) {
      handleError('Error: Failed to communicate with the server.');
    }
  };

  const handleError = (errorMessage) => {
    setMessages((prevMessages) => [...prevMessages, { role: 'ai', text: errorMessage }]);
    speakText(errorMessage, () => {
      setIsUserTurn(true);  // Switch back to user turn even on error
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Chat with Gemini</h1>
      <div
        className="subtitleDiv"
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
      {isUserTurn ? (
        <p style={{ textAlign: 'center' }}>Your turn to speak...</p>
      ) : (
        <p style={{ textAlign: 'center' }}>Listening to Gemini...</p>
      )}
    </div>
  );
}
