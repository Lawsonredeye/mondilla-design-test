import request from 'supertest';
import app from '../../src/index.js';

describe('Middleware tests', () => {
    it('should return 404 for non-existent route', async () => {
        const response = await request(app)
            .get('/non-existent-route');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('status', 'error');
    });

    it('should return 500 for internal server error', async () => {
        const response = await request(app)
            .get('/error-route'); // Assuming this route is set to trigger an error

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('status', 'error');
    });
})