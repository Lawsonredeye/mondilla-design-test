import request from 'supertest';
import app from '../../src/index.js'
import 'dotenv/config.js'

const CLIENT_TOKEN = process.env.CLIENT_JWT
const FREELANCER_TOKEN = process.env.FREELANCER_JWT

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

        const res = await request(app).delete(`/projects/${projectId}`).set('authorization', CLIENT_TOKEN);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({
            message: "Project not found",
            status: "error"
        });
    })

    it('should return an error for forbidden access when deleting a project as a non-client user', async () => {
        const projectId = '1';
        const res = await request(app).delete(`/projects/${projectId}`)
        .set('authorization', FREELANCER_TOKEN)
        expect(res.statusCode).toEqual(403);
        expect(res.body).toEqual({
            message: "Forbidden: Only admin and clients can delete projects",
            status: "error"
        });
    })

    it('should return an error for unauthorized access when deleting a project with invalid ID', async () => {
        const projectId = 'invalid-id';

        const res = await request(app).delete(`/projects/${projectId}`)
            .set('authorization', CLIENT_TOKEN)


        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            message: "Invalid project ID",
            status: "error"
        });
    })

    // it('should delete project successfully', async () => {
    //     const projectId = '2';
    //
    //     const res = await request(app).delete(`/projects/${projectId}`)
    //         .set('authorization',  CLIENT_TOKEN);
    //
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toEqual({
    //         message: "Project deleted successfully",
    //         status: "success"
    //     });
    // })
})

describe('GET /projects', () => {
    it('should return an error for invalid project ID', async () => {
        const projectId = 'invalid-id';

        const res = await request(app).get(`/projects/${projectId}`)
            .set('authorization', CLIENT_TOKEN);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            message: "Invalid project ID",
            status: "error"
        });
    })

    it('should return an error for unauthorized access when retrieving projects', async () => {
        const res = await request(app).get('/projects');

        expect(res.statusCode).toEqual(401);
        expect(res.body).toEqual({
            message: "Unauthorized access",
            status: "error"
        });
    })

    it('should return success for a single project with valid ID', async () => {
        const projectId = '5';

        const res = await request(app).get(`/projects/${projectId}`)
            .set('authorization', CLIENT_TOKEN);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
                "message": "Project retrieved successfully",
                "status": "success",
                "project": {
                    "id": 5,
                    "clientId": 2,
                    "title": "first project",
                    "description": "Project one",
                    "budgetMin": "200",
                    "budgetMax": "300.32",
                    "status": "OPEN",
                    "createdAt": "2025-08-17T05:44:21.237Z",
                    "updatedAt": "2025-08-17T05:44:21.237Z"
                }
            }
        )
    })

    it('should return success for retrieving all projects', async () => {
        const res = await request(app).get('/projects')
            .set('authorization', CLIENT_TOKEN);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "message": "Projects retrieved successfully",
            "status": "success",
            "projects": expect.any(Array)
        });
    })

})

describe('PATCH /projects/:id/:status', () => {
    it('should change the status of a project from OPEN to CLOSED', async () => {
        const projectId = '4';

        const res = await request(app).patch(`/projects/${projectId}/close`)
            .set('authorization', CLIENT_TOKEN);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            message: "Project status updated to CLOSED",
            status: "success"
        })
    })

    it('should change the status of a project from DRAFT to OPEN', async () => {
        const projectId = '4';

        const res = await request(app).patch(`/projects/${projectId}/open`)
            .set('authorization', CLIENT_TOKEN);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            message: "Project status updated to open",
            status: "success",
        })
    })
})