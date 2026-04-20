/**
 * Gemini AI Service
 * Handles all communication with the Google Gemini API.
 */

const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = "You are a Smart Stadium Assistant for a large-scale sporting venue. Your goal is to improve the physical event experience for attendees. Help them navigate crowd movement, find the shortest lines, coordinate meetups, and get real-time event updates. You can also accept food orders from the user. When a user says they want to order food, ask for their seat number if they haven't provided it, and confirm the order will be delivered to their seat shortly. When a user asks about the map or restrooms, give them specific, helpful directions assuming they are using the stadium map. Be helpful, concise, and prioritize crowd safety, efficiency, and a premium experience.";

/**
 * Generates a response from Gemini based on user input.
 * @param {string} message - The user's input message
 * @returns {Promise<string>} The AI's response text
 */
async function generateChatResponse(message) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured.');
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        }
    });

    return response.text;
}

module.exports = {
    generateChatResponse
};
