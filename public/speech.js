const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

let finalTranscript = '';
let speaking = false;
let silenceTimer;

recognition.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
        } else {
            interimTranscript += event.results[i][0].transcript;
        }
    }

    // Update the subtitle div (optional)
    document.querySelector('subtitle').innerHTML = finalTranscript + '<i>' + interimTranscript + '</i>';

    // Restart the silence timer
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
        recognition.stop();
        if (finalTranscript.trim() !== '') {
            handleUserSpeech(finalTranscript.trim());
            finalTranscript = '';
        }
    }, 5000);
};

recognition.onend = () => {
    if (!speaking) {
        recognition.start();  // Restart recognition if not speaking
    }
};

recognition.onerror = (event) => {
    console.error(event.error);
};

function startRecognition() {
    recognition.start();
}

function handleUserSpeech(transcript) {
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: transcript }),
    })
    .then(response => response.json())
    .then(data => {
        addMessageToChat('Gemini', data.response);
        speakResponse(data.response);
        startRecognition();  // Restart listening after speaking
    })
    .catch(error => console.error('Error:', error));
}
