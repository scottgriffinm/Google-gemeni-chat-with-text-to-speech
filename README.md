# Google Gemini Voice Chat (Next.js)

This is a simple Next.js application that allows users to voice chat with Google Gemeni via its public API.

<img width="587" alt="Chat with Gemini" src="https://github.com/user-attachments/assets/505b17b0-8257-4ac1-ae6e-e7d4ee5b49f7">

## Getting Started

1. Clone the repository.
2. Install the dependencies with `npm install`. (you must have Node.js version >=18 installed)
3. Register your Google Gemini API key and add it to `.env.local` i.e. API_KEY=<api_key_here>.
4. Run the development server with `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Route

The API route is located at `pages/api/chat.js`. It handles communication with the Google Gemini API.

## Frontend

The chat interface is implemented in `pages/index.js`. It allows users to send messages and display responses from the Gemini API.

## Deployment

To deploy, build the application with `npm run build` and then start the server with `npm start`.
