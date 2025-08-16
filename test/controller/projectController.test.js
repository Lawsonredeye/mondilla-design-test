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

    it('should return an error for unauthorized access when deleting a non-existent project', async () => {
        const projectId = '9999';

        const res = await request(app).delete(`/projects/${projectId}`).set('authorization', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VyX25hbWUiOiJqYW5lIGRvZSIsInJvbGUiOiJDTElFTlQiLCJpYXQiOjE3NTUzNzQ2NDYsImV4cCI6MTc1NTQxMDY0Nn0.6quoPsOkHBzCJQ4WjxkJR73Jvib853QsHnQtJaJA-Oc");

        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({
            message: "Project not found",
            status: "error"
        });
    })

    it('should return an error for unauthorized access when deleting a project with invalid ID', async () => {
        const projectId = 'invalid-id';

        const res = await request(app).delete(`/projects/${projectId}`).set('authorization', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJqb2huIGRvZSIsInJvbGUiOiJGUkVFTEFOQ0VSIiwiaWF0IjoxNzU1Mzc0NzM4LCJleHAiOjE3NTU0MTA3Mzh9.tTaN5GBZBq8vGIjxSpjfR3e2rkdAIC5qxE0dGj0wtzk",
        );

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            message: "Invalid project ID",
            status: "error"
        });
    })

    it('should delete project successfully', async () => {
        const projectId = '2';

        const res = await request(app).delete(`/projects/${projectId}`)
            .set('authorization',  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VyX25hbWUiOiJqYW5lIGRvZSIsInJvbGUiOiJDTElFTlQiLCJpYXQiOjE3NTUzNzQ2NDYsImV4cCI6MTc1NTQxMDY0Nn0.6quoPsOkHBzCJQ4WjxkJR73Jvib853QsHnQtJaJA-Oc",
            );

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            message: "Project deleted successfully",
            status: "success"
        });
    })
})