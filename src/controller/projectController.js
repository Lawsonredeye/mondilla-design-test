import express from "express";
import { PrismaClient } from '../generated/prisma/index.js';
import { validateProjectInput} from "../pkg/validator/userInput.js";

const projectRouter = express.Router();
const prisma = new PrismaClient();
projectRouter.post("/", async (req, res) => {
    if (req.role !== "CLIENT") {
        return res.status(403).send({"message": "Forbidden: Only clients can create projects", "status": "error"});
    }
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

    res.status(201).json({"message": "Project created successfully", "status": "success", project});
});

projectRouter.get("/", async (req, res) => {
    const queries = req.query;
    const where = {};

    if (queries.status) {
        where.status = queries.status.toUpperCase();
    }
    if (queries.title) {
        where.title = {
            contains: queries.title,
            mode: 'insensitive'
        };
    }
    if (queries.description) {
        where.description = {
            contains: queries.description,
            mode: 'insensitive'
        };
    }
    if (queries.budgetMin) {
        where.budgetMin = { gte: parseFloat(queries.budgetMin) };
    }
    if (queries.budgetMax) {
        where.budgetMax = { lte: parseFloat(queries.budgetMax) };
    }
    try {

        const projects = await prisma.project.findMany({ where });
        res.json({"message": "Projects retrieved successfully", "status": "success", projects});
    } catch (e) {
        console.error("Error retrieving projects:", e);
        return res.status(500).send({"message": "Something went wrong please check your filter query and try again", "status": "error"});
    }
})


projectRouter.get("/client", async (req, res) => {
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
    if (req.role !== "CLIENT" || req.role !== "ADMIN") {
        return res.status(403).send({"message": "Forbidden: Only admin and clients can delete projects", "status": "error"});
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

projectRouter.get("/:id", async (req, res) => {
  const projectId = parseInt(req.params.id);
  if (isNaN(projectId)) {
      return res.status(400).send({"message": "Invalid project ID", "status": "error"});
  }

  const response = await prisma.project.findUnique({
      where: {
          id: projectId
      }
    });
    if (!response) {
        return res.status(404).send({"message": "Project not found", "status": "error"});
    }
    res.json({"message": "Project retrieved successfully", "status": "success", project: response});
})

projectRouter.patch('/:id/:status', async (req, res) => {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
        return res.status(400).send({"message": "Invalid project ID", "status": "error"});
    }

    let status = req.params.status;
    if (!["open", "close"].includes(status)) {
        return res.status(400).send({"message": "Invalid project status", "status": "error"});
    }
    if (status === "close") status = "CLOSED";

    const clientId = req.clientId;
    if (!clientId) {
        return res.status(401).send({"message": "Unauthorized access", "status": "error"});
    }

    await prisma.project.update({
        where: {
            id: projectId,
            clientId: clientId
        },
        data: {
            status: status.toUpperCase()
        }
    });

    res.json({"message": `Project status updated to ${status}`, "status": "success"});
})

projectRouter.post('/:id/applications', async (req, res) => {
    if (req.role !== "FREELANCER") {
        return res.status(403).send({"message": "Forbidden: Only freelancers can apply to projects", "status": "error"});
    }
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
        return res.status(400).send({"message": "Invalid project ID", "status": "error"});
    }

    const freelancerId = req.clientId;
    if (!freelancerId) {
        return res.status(401).send({"message": "Unauthorized access", "status": "error"});
    }

    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).send({"message": "Invalid request body", "status": "error"});
    }
    if (!req.body.coverLetter || !req.body.bidAmount) {
        return res.status(400).send({"message": "Cover letter and bid amount are required", "status": "error"});
    }

    let {coverLetter, bidAmount} = req.body;
    bidAmount = parseFloat(bidAmount);

    if (isNaN(bidAmount) || bidAmount <= 0) {
        return res.status(400).send({"message": "Bid amount must be a positive number", "status": "error"});
    }

    try {
        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        });
        if (!project) {
            return res.status(404).send({"message": "Project not found", "status": "error"});
        }
    } catch (error) {
        console.error("Error retrieving project:", error);
        return res.status(500).send({"message": "Something went wrong while retrieving the project", "status": "error"});
    }

    try {

        const application = await prisma.application.create({
            data: {
                projectId,
                freelancerId,
                coverLetter,
                bidAmount,
            }
        });

        res.status(201).json({"message": "Application submitted successfully", "status": "success", application});
    } catch (error) {
        console.error("Error creating application:", error);
        return res.status(409).send({"message": "Can't apply for same project", "status": "error"});
    }
})

export default projectRouter;
