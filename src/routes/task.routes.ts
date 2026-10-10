import { createTask , getTasks,  getTaskById,  updateTask,  deleteTask} from "../controllers/task.controllers.js";
import { validateTaskId } from "../middleware/task.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router()

router.post("/", authenticate, createTask);;
router.get("/",authenticate, getTasks);
router.get("/:id", authenticate, validateTaskId, getTaskById);
router.patch("/:id", authenticate, validateTaskId, updateTask);
router.delete("/:id",authenticate,validateTaskId, deleteTask);


export default router
