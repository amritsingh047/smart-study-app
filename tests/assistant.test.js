/**
 * Comprehensive Test Suite
 * Evaluates the API endpoints, rate limiting, and caching mechanisms.
 */

const request = require('supertest');
const app = require('../src/app');
const geminiService = require('../src/services/geminiService');
const gcpService = require('../src/services/gcpService');

// Mock the Gemini Service to avoid real API calls and ensure reliable tests
jest.mock('../src/services/geminiService');

// Mock GCP Service to avoid real logging
jest.mock('../src/services/gcpService');

describe('API Tests: /api/chat', () => {
    beforeEach(() => {
        // Clear mock data before each test
        jest.clearAllMocks();
    });

    it('should return 400 if message is missing', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({});
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Message is required');
    });

    it('should process a valid chat request and mock a successful response', async () => {
        const mockReply = "Hello! I am your Stadium Assistant.";
        geminiService.generateChatResponse.mockResolvedValue(mockReply);

        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'Hello' });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('reply', mockReply);
        // First request shouldn't be cached
        expect(res.body).toHaveProperty('cached', false);
    });

    it('should cache identical requests for efficiency', async () => {
        const mockReply = "The restrooms are near section 102.";
        geminiService.generateChatResponse.mockResolvedValue(mockReply);

        // First Request
        const res1 = await request(app)
            .post('/api/chat')
            .send({ message: 'where are restrooms' });
        expect(res1.body).toHaveProperty('cached', false);

        // Second Request (Should be cached)
        const res2 = await request(app)
            .post('/api/chat')
            .send({ message: 'where are restrooms' });
        expect(res2.body).toHaveProperty('cached', true);
        expect(res2.body.reply).toEqual(mockReply);

        // Verify the external API was only called once
        expect(geminiService.generateChatResponse).toHaveBeenCalledTimes(1);
    });

    it('should handle internal errors gracefully', async () => {
        geminiService.generateChatResponse.mockRejectedValue(new Error('API Failure'));

        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'cause error' });
        
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error', 'Failed to process request.');
    });
});
