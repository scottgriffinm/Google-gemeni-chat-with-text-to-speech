// Helper functions

// Select a DOM element using a CSS selector
function getElement(selector) {
    return document.querySelector(selector);
}

// Function to find and store the Moira voice from available voices
function findMoiraVoice(synthInstance) {
    const voices = synthInstance.getVoices();
    for(let i = 0; i < voices.length; i++) {
        if (voices[i].name === 'Moira' && voices[i].lang === 'en-IE') {
            return voices[i];  // Return the Moira voice if found
        }
    }
    return null;  // Return null if Moira voice is not found
}

// Function to speak the provided text using Moira's voice
function speakText(text) {
    const synthInstance = window.speechSynthesis || null;
    if (!synthInstance) return;  // Exit if speech synthesis is not supported

    const moiraVoice = findMoiraVoice(synthInstance);
    if (!moiraVoice) {
        console.error('Moira voice not found');
        return;
    }

    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = moiraVoice;  // Set the voice to Moira
    utterThis.pitch = 0.7;  // Set pitch
    utterThis.rate = 0.75;  // Set rate
    synthInstance.speak(utterThis);  // Speak the text
}

// Export the speakText function
export { speakText };
