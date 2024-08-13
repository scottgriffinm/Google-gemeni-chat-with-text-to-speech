# Next.js Gemini Chat

This is a simple Next.js application for chatting with Google Gemeni LLM with responses read aloud with the Speech Synthesis TTS JS library.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/897257d4-44a3-40f6-b803-04b4ac4a2a2c">

## Getting Started

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Add your Google Gemini API key to `.env.local`.
4. Run the development server with `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Route

The API route is located at `pages/api/chat.js`. It handles communication with the Google Gemini API.

## Frontend

The chat interface is implemented in `pages/index.js`. It allows users to send messages and display responses from the Gemini API.

## Deployment

To deploy, build the application with `npm run build` and then start the server with `npm start`.
