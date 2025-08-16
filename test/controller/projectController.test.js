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
            .set(
                "authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VyX25hbWUiOiJqYW5lIGRvZSIsInJvbGUiOiJDTElFTlQiLCJpYXQiOjE3NTUzNzA1MDcsImV4cCI6MTc1NTM3NzcwN30.2lCjzk7btXulJW4k8DW7z6KpcQrfYOY_-Q_pm6J0zpk", // this would expire in 2 hours so, don't worry about this.
            )
            .send(newProject);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Project created successfully');
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.project).toHaveProperty('id');
    });
})