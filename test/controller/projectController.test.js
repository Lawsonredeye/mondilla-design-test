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

    it('should create a new project successfully', async () => {
        const newProject = {
            title: "Test Project Title",
            description: "This is a test project.",
            status: "OPEN",
            budgetMin: 100.00,
            budgetMax: 300.00,
        };

        const res = await request(app).post('/projects')
            .headers({
                authorization: "test"
            })
            .send(newProject);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Project created successfully');
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.project).toHaveProperty('id'); // Assuming the project has an id
    });
})