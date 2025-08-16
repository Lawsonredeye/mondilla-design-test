import CreateJwtToken from "../pkg/validator/jwt_validator.js";
import { PrismaClient } from '../generated/prisma/index.js';
import { validateUserInput } from "../pkg/validator/userInput.js";


import express from 'express';
import {Hashpassword, ValidatePassword} from "../pkg/validator/password_validator.js";

const userRouter = express.Router()
const prisma = new PrismaClient()

userRouter.post("/register", async (req, res) => {
    let {name, email, password, role} = req.body;
    if (!role) role = "FREELANCER";
    const valid = validateUserInput({name, email, password});
    if (valid !== null) {
        return res.status(400).send({"message": valid, "status": "error"});
    }
    const passwordHash = Hashpassword(password);
    if (!passwordHash) {
        return res.status(400).send({"message": "can't hash password", "status": "error"});
    }
    const resp = await prisma.user.create({
        data: {
            name,
            email,
            role,
            passwordHash,
        }
    })
    res.json({"message": "user created successfully.", "status": "success"});
})

userRouter.post("/login", async (req, res) => {
    if (!req.body) return res.status(400).send({"message": "email and password is required", status: "error"});
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).send({"message": "email and password is required"});
    }
    const result = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if (!result) {
        return res.status(400).send({"message": "invalid email or password"});
    }
    if (ValidatePassword(password, result.passwordHash) === false) {
        return res.status(400).send({"message": "invalid email or password"});
    }

    const token = CreateJwtToken(result.id, result.name, result.role)
    if (token === null ) return res.status(500).send({"message": "something happened, please try again", status: "error"})
    return res.status(200).send({"message": "User logged in", "access_token": token, "status": "success"});
})

export default userRouter;