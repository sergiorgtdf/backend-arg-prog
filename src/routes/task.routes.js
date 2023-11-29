import { Router } from "express";
import { taskValidationRules } from "../middlewares/task.validations.js";
import {
    createTask,
    getAllTask,
    getTaskById,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js";

import { authRequired } from "../middlewares/validateToken.js";

const taskRoutes = Router();

taskRoutes.get("/task", authRequired, getAllTask);

taskRoutes.get("/task/:id", authRequired, getTaskById);

taskRoutes.post("/task", authRequired, taskValidationRules, createTask);

taskRoutes.put("/task/:id", authRequired, taskValidationRules, updateTask);

taskRoutes.delete("/task/:id", authRequired, deleteTask);

export default taskRoutes;
