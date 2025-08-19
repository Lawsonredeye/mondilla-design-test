# Mondilla Design Test

This is a design test for Mondilla. The goal is to create a simple web application that allows users to view and manage a list of items.

## Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)
- PostgreSQL database

## .env setup
```shell

   JWT_KEY="your jwt secret key here"
   
   FREELANCER_JWT="a logged in freelancer jwt access token" // check the /prisma/seed.js
   CLIENT_JWT="a logged in client jwt access token"
```

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Lawsonredeye/mondilla-design-test.git
    cd mondilla-design-test
    ```
2. Install dependencies:
3. ```bash
   npm install
   ```
4. Set up prisma:
   ```bash
   cd src/prisma
   npx prisma migrate reset dev --name init
   ```
   This command will create the necessary database tables based on the Prisma schema.
5. Seed the database with initial data:
   ```bash
    npx prisma db seed
    ```
6. Start the development server:
   ```bash
   npm run start
   ```
**Note**: Ensure that your PostgreSQL database is running and the connection details are correctly set in the `.env` file.
   
## Chosen track
I used Node.js + Express for the backend. This choice was made because I am more comfortable with JavaScript and Node.js, and it allows for rapid development with prototyping.

## Endpoints
### Authentication
```curl
http://localhost:3000/auth/login -d '{"email": "johndoe@mail.com", "password": "i am admin"}' -H "Content-Type: application/json"
```

### Projects
Delete a project
```curl
curl --location --request DELETE 'http://localhost:3000/projects/999' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJqYW5ldCBkb2UiLCJyb2xlIjoiQ0xJRU5UIiwiaWF0IjoxNzU1NTA1ODcxLCJleHAiOjE3NTU1NDE4NzF9.B2I80_9souK4Uc0m1G8qUqcnga076Mcr4_NdTcTSCOk'
```

create a project
```curl
curl --location 'http://localhost:3000/projects' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJqYW5ldCBkb2UiLCJyb2xlIjoiQ0xJRU5UIiwiaWF0IjoxNzU1NTA1ODcxLCJleHAiOjE3NTU1NDE4NzF9.B2I80_9souK4Uc0m1G8qUqcnga076Mcr4_NdTcTSCOk' \
--data '{
    "title": "create a backend for mondillo test",
    "description": "Project 4th",
    "budgetMin": 3000.10,
    "budgetMax": 3003.32,
    "status": "OPEN"
}'
```

Get a project
```curl
curl --location 'http://localhost:3000/projects/6' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJqYW5ldCBkb2UiLCJyb2xlIjoiQ0xJRU5UIiwiaWF0IjoxNzU1NTA1ODcxLCJleHAiOjE3NTU1NDE4NzF9.B2I80_9souK4Uc0m1G8qUqcnga076Mcr4_NdTcTSCOk'
```

### Applications
Get an application request
```curl
curl --location --request GET 'http://localhost:3000/projects/me/applications' \
--header 'Content-Type: text/plain' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJqYW5ldCBkb2UiLCJyb2xlIjoiQ0xJRU5UIiwiaWF0IjoxNzU1NTA1ODcxLCJleHAiOjE3NTU1NDE4NzF9.B2I80_9souK4Uc0m1G8qUqcnga076Mcr4_NdTcTSCOk' \
--data '{
    "coverLetter": "i am applying to this job",
    "bidAmount": "1000.32"
}'
```
**Note**: The above endpoint need a FREELANCER JWT token in the Authorization header. You can obtain a token by logging in through the authentication endpoint.

Create an application request
```curl
curl --location 'http://localhost:3000/projects/2/applications' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJqYW5ldCBkb2UiLCJyb2xlIjoiQ0xJRU5UIiwiaWF0IjoxNzU1NTA1ODcxLCJleHAiOjE3NTU1NDE4NzF9.B2I80_9souK4Uc0m1G8qUqcnga076Mcr4_NdTcTSCOk' \
--data '{
    "coverLetter": "i am applying to this job",
    "bidAmount": "1000.32"
}'
```

**Note**: The above endpoints require a valid JWT token in the Authorization header. You can obtain a token by logging in through the authentication endpoint.

Link to postman collection: [Mondilla Design Test Postman Collection](https://www.postman.com/mandobackendteam/workspace/mondilla-test/collection/36431925-c418e952-1aa5-4f80-9d6f-9e258db223d0?action=share&creator=36431925&active-environment=36431925-41966b14-b1bc-482f-b678-60e4f5206f70)


