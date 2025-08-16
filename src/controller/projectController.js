import express from "express";
import { PrismaClient } from '../generated/prisma/index.js';
import { validateProjectInput} from "../pkg/validator/userInput.js";

const projectRouter = express.Router();
const prisma = new PrismaClient();
projectRouter.post("/", async (req, res) => {
    const isValid = validateProjectInput(req.body)
    if (isValid !== null) {
        return res.status(400).send({"message": isValid, "status": "error"});
    }

    let {title, description, status, budgetMin, budgetMax} = req.body;
    if (!status) status = "DRAFT"
    const clientId = req.clientId;

    if (!clientId) {
        return res.status(401).send({"message": "Unauthorized access", "status": "error"});
    }

    const project = await prisma.project.create({
        data: {
            title,
            description,
            status,
            budgetMin,
            budgetMax,
            clientId
        }
    });

    res.json({"message": "Project created successfully", "status": "success", project});
});

projectRouter.get("/", async (req, res) => {
    const clientId = req.clientId;

    if (!clientId) {
        return res.status(401).send({"message": "Unauthorized access", "status": "error"});
    }

    const projects = await prisma.project.findMany({
        where: {
            clientId: clientId
        }
    });

    res.json({"message": "Projects retrieved successfully", "status": "success", projects});
})

projectRouter.delete("/:id", async (req, res) => {
    const clientId = req.clientId;
    if (!clientId) {
        return res.status(401).send({"message": "Unauthorized access", "status": "error"});
    }

    try{
        const projectId = parseInt(req.params.id);
        if (isNaN(projectId)) {
            return res.status(400).send({"message": "Invalid project ID", "status": "error"});
        }
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                clientId: clientId
            }
        });

        if (!project) {
            return res.status(404).send({"message": "Project not found", "status": "error"});
        }

        await prisma.project.delete({
            where: {
                id: projectId
            }
        });

        res.json({"message": "Project deleted successfully", "status": "success"});
    } catch (error) {
        console.error("Error parsing project ID:", error);
        return res.status(400).send({"message": "Invalid project ID", "status": "error"});
    }

})

export default projectRouter;
