import { PrismaClient } from "../generated/prisma/index.js";
import {Hashpassword} from "../pkg/validator/password_validator.js";

const prisma = new PrismaClient()

async function main() {
    const password = Hashpassword("i am admin")
    const jane = await prisma.user.create({
        data: {
            name: "jane doe",
            email: "janedoe@mail.com",
            passwordHash: password,
            role: "CLIENT"
        }
    })
    const john = await prisma.user.create({
        data: {
            name: "john doe",
            email: "johndoe@mail.com",
            passwordHash: password,
        }
    })
    const test = await prisma.user.create({
        data: {
            name: "test",
            email: "johnnytest@mail.com",
            passwordHash: password,
            role: "ADMIN"
        }
    })

    const proj = await prisma.project.create({
        data: {
            clientId: 1,
            title: "test project 1",
            description: "test project 1 description",
            budgetMin: 1000.12,
            budgetMax: 1001.13,
            status: "OPEN",
        }
    })

    const proj2 = await prisma.project.create({
        data: {
            clientId: 1,
            title: "test project 2",
            description: "test project 2 description",
            budgetMin: 500.12,
            budgetMax: 1001.13,
            status: "OPEN",
        }
    })

    const proj3 = await prisma.project.create({
        data: {
            clientId: 1,
            title: "test project 3",
            description: "test project 3 description",
            budgetMin: 500.12,
            budgetMax: 1001.13,
            status: "OPEN",
        }
    })

    const proj4 = await prisma.project.create({
        data: {
            clientId: 1,
            title: "test project 4",
            description: "test project 4 description",
            budgetMin: 300.12,
            budgetMax: 900.13,
        }
    })

    const proj5 = await prisma.project.create({
        data: {
            clientId: 1,
            title: "test project 5",
            description: "test project 5 description",
            budgetMin: 300.12,
            budgetMax: 900.13,
        }
    })

    const proj6 = await prisma.project.create({
        data: {
            clientId: 1,
            title: "test project 6",
            description: "test project 6 description",
            budgetMin: 300.12,
            budgetMax: 900.13,
        }
    })

    const freelanceApply = await prisma.application.create({
        data: {
            projectId: proj.id,
            freelancerId: john.id,
            coverLetter: "I am interested in this project",
            bidAmount: 1000.00
        }
    })

    const freelanceApply2 = await prisma.application.create({
        data: {
            projectId: proj2.id,
            freelancerId: john.id,
            coverLetter: "I am interested in this project",
            bidAmount: 500.00
        }
    })

    const freelanceApply3 = await prisma.application.create({
        data: {
            projectId: proj3.id,
            freelancerId: john.id,
            coverLetter: "I am interested in this project",
            bidAmount: 600.00
        }
    })
    console.log("Database seeding before running the server")
    console.log({
        jane, john, test, proj, proj2, proj3, proj4, proj5, proj6,
        freelanceApply, freelanceApply2, freelanceApply3
    })
    console.log("Database seeded successfully")
}

main()
    .then( async() => {
        await prisma.$disconnect()
    })
    .catch(async (err) => {
        console.error(err)
        await prisma.$disconnect()
        process.exit(1)
    })
