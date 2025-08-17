import request from 'supertest';
import app from '../../src/index.js'
import 'dotenv/config.js'

const CLIENT_TOKEN = process.env.CLIENT_JWT
const FREELANCER_TOKEN = process.env.FREELANCER_JWT

describe('Applications Controller', () => {
    it('should return an error for unauthorized access to apply to client project', async () => {
        const projectId = 3
        const response = await request(app)
            .post(`/projects/${projectId}/applications`)

        expect(response.statusCode).toEqual(401);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Unauthorized access');
    })

    it('should return an error for forbidden access to non-freelancers', async ()=> {
        const projectId = 3
        const response = await request(app)
            .post(`/projects/${projectId}/applications`)
            .set('Authorization', CLIENT_TOKEN)
            .send({
                coverLetter: 'I am a freelancer applying for this project.',
                bidAmount: 100
            })
        expect(response.statusCode).toEqual(403);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message', 'Forbidden: Only freelancers can apply to projects');
    })

    it('should return success for authorized access to apply to client project', async () => {
        const projectId = 6 // todo: change this to prevent error when testing
        const response = await request(app)
            .post(`/projects/${projectId}/applications`)
            .set('Authorization', FREELANCER_TOKEN)
            .send({
                coverLetter: 'I am a freelancer applying for this project.',
                bidAmount: 100
            })

        expect(response.statusCode).toEqual(201);
    })

    it('should return all freelancers applications', async () => {
        const response = await request(app)
            .get('/projects/me/applications')
            .set('Authorization', FREELANCER_TOKEN)

        expect(response.statusCode).toEqual(200);
    })

    it('should return all client applications', async () => {
        const projectId = 3
        const response = await request(app)
            .get(`/projects/${projectId}/applications`)
            .set('Authorization', CLIENT_TOKEN)

        expect(response.statusCode).toEqual(200);
    });
})