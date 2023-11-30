import { Router } from "express";
import { taskValidationRules } from "../middlewares/task.validations.js";
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js";

import { authRequired } from "../middlewares/validateToken.js";

const taskRoutes = Router();

// obtiene todo
taskRoutes.get("/task", authRequired, getAllTasks);
// obtiene por id
taskRoutes.get("/task/:id", authRequired, getTaskById);
// crea
taskRoutes.post("/task", authRequired, taskValidationRules, createTask);
// actualiza
taskRoutes.put("/task/:id", authRequired, taskValidationRules, updateTask);
// elimina
taskRoutes.delete("/task/:id", authRequired, deleteTask);

export default taskRoutes;
