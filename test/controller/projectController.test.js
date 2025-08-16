import request from 'supertest';
import app from '../../src/index.js'

describe('POST /projects', () =>  {
    it('should return an error for unauthorized access when creating a project', async () => {
        const newProject = {
            name: "Unauthorized Project",
            title: "Unauthorized Project Title",
            description: "This project should not be created due to unauthorized access.",
            status: "OPEN",
            budgetMin: 200.00,
            budgetMax: 500.00,
        };

        const res = await request(app).post('/projects')
            .send(newProject);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
            message: "Unauthorized access",
            status: "error"
        });

    })
})

describe('DELETE /projects/:id', () => {
    it('should return an error for unauthorized access when deleting a project', async () => {
        const projectId = '1';

        const res = await request(app).delete(`/projects/${projectId}`);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
            message: "Unauthorized access",
            status: "error"
        });
    })
})