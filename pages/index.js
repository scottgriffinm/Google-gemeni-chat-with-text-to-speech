import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import '../public/tts.js';  // Import TTS functionality
import '../public/speech.js';  // Import Speech-to-Text functionality

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [currentSpeaker, setCurrentSpeaker] = useState('User');

    useEffect(() => {
        startRecognition();  // Start speech recognition when the component mounts
    }, []);

    const addMessageToChat = (sender, text) => {
        setMessages((prevMessages) => [...prevMessages, { sender, text }]);
        setCurrentSpeaker(sender === 'User' ? 'Gemini' : 'User');
    };

    const speakResponse = (text) => {
        setCurrentSpeaker('Gemini');
        const msg = new SpeechSynthesisUtterance(text);
        msg.onend = () => setCurrentSpeaker('User');
        window.speechSynthesis.speak(msg);
    };

    return (
        <div className={styles.container}>
            <h1>Voice Chat with Gemini</h1>
            <div className={styles.chatWindow}>
                {messages.map((message, index) => (
                    <div key={index} className={message.sender === 'User' ? styles.userMessage : styles.geminiMessage}>
                        <strong>{message.sender}: </strong>{message.text}
                    </div>
                ))}
            </div>
            <div className={styles.speakerIndicator}>
                {currentSpeaker === 'User' ? 'Listening...' : 'Gemini is speaking...'}
            </div>
        </div>
    );
}
