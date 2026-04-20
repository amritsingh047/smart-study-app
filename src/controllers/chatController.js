/**
 * Chat Controller
 * Handles incoming chat requests, applies caching for efficiency,
 * and interfaces with the Gemini and GCP services.
 */

const NodeCache = require('node-cache');
const geminiService = require('../services/geminiService');
const gcpService = require('../services/gcpService');

// Initialize Cache (Store items for 60 seconds) - Efficiency Boost
const chatCache = new NodeCache({ stdTTL: 60 });

/**
 * Processes a chat request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleChatRequest(req, res) {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const normalizedMessage = message.trim().toLowerCase();

        // 1. Efficiency: Check Cache
        const cachedResponse = chatCache.get(normalizedMessage);
        if (cachedResponse) {
            gcpService.writeLog('INFO', 'Cache hit for query', { query: normalizedMessage });
            return res.json({ reply: cachedResponse, cached: true });
        }

        // 2. Process via Gemini API
        gcpService.writeLog('INFO', 'Sending query to Gemini API', { query: normalizedMessage });
        const reply = await geminiService.generateChatResponse(message);

        // 3. Efficiency: Save to Cache
        chatCache.set(normalizedMessage, reply);

        // 4. Google Services: Backup to GCS (Mock)
        gcpService.backupChatLogToGCS(req.ip, { message, reply });

        res.json({ reply, cached: false });
    } catch (error) {
        gcpService.writeLog('ERROR', 'Chat processing failed', { error: error.message });
        console.error('Error in chat controller:', error);
        res.status(500).json({ error: 'Failed to process request.' });
    }
}

module.exports = {
    handleChatRequest
};
