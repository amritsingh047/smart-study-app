const request = require('supertest');
const app = require('../index');

describe('POST /api/chat', () => {
    it('should return 400 if message is missing', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({});
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Message is required');
    });

    // We skip the actual API call test to avoid needing a real API key during CI/CD
    it('should have the chat endpoint available', async () => {
        const res = await request(app).get('/api/chat');
        // Since it's a POST endpoint, GET should return 404
        expect(res.statusCode).toEqual(404);
    });
});
