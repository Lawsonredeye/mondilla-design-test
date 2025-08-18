import request from 'supertest';
import app from '../../src/index.js';
import 'dotenv/config.js'



describe('POST /users', () =>  {
    it('should return an error if user data is missing', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({"name": "testsubject", "email": "test@mail.com"})

        expect(response.status).toBe(400);
    })
    it('should return success for creating a freelancer account', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                "name": "testsubject",
                "email": "test@mail.com",
                "password": "testpassword"
            })

        expect(response.statusCode).toBe(200);
    })
    it('should return an error for duplicate email', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                "name": "testsubject",
                "email": "test@mail.com",
                "password": "testpassword"
            })
        expect(response.statusCode).toBe(409);
    })
})

describe('POST /auth/login', () => {
    it('should return an error for missing email or password', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({"email": "test@mail.com"})
        expect(response.status).toBe(400);
    })
    it('should return an error for invalid email or password', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({"email": "test@mail.com", "password": "wrongpassword"})
        expect(response.status).toBe(400);
    })
    it('should return success for valid login', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({"email": "johndoe@mail.com", "password": "i am admin"})
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('access_token', expect.any(String));
    })
})