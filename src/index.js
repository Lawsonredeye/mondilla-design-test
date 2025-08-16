import express from 'express';
import userRouter from './controller/userController.js'
import projectRouter from './controller/projectController.js';
import protectedAuth from "./controller/auth.js";

const app = express();

app.use(express.json());

app.use("/users", userRouter)

app.get("/ping", (req, res) => {
    res.json({"message": "Welcome to the User Management API", "status": "success"});
})
app.use(protectedAuth)
app.use("/projects", projectRouter)
export default app;