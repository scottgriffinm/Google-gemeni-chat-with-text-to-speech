import { google } from '@google/generative-ai';

const client = new google.generativeai.TextServiceClient();

export default async function handler(req, res) {
    const { message } = req.body;

    try {
        const [response] = await client.generateText({
            prompt: { text: message },
            model: 'text-bison-001',  // Replace with the appropriate model ID
        });

        const geminiResponse = response.candidates[0]?.output || "Sorry, I didn't understand that.";

        res.status(200).json({ response: geminiResponse });
    } catch (error) {
        console.error('Error interacting with Gemini:', error);
        res.status(500).json({ response: 'Sorry, something went wrong.' });
    }
}
