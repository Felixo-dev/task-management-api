import type { Request, Response } from "express";
import {
  createTask as createTaskService,
  getTasks as getTasksService,
  getTaskById as getTaskByIdService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  
} from "../services/task.service.js";
import { taskSchema, updateTaskSchema,paginationSchema } from "../schemas/task.schema.js";

//create task function
export const createTask = async (req: Request, res: Response) => {
  const result = taskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  const { title, description } = result.data; //it is result.data because it's the data that passes through our validation. req.body is simply whatever the client sent. 

  if (req.userId === undefined) {
  return res.status(401).json({
    message: "Authentication required",
  });
}

const task = await createTaskService(
  title,
  description,
  req.userId
);


  res.status(201).json({
    message: "Task created successfully",
    task,
  });
};

//Get task function
export const getTasks = async (req: Request, res: Response) => {
  const result = paginationSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid pagination parameters",
      errors: result.error.issues,
    });
  }

if (req.userId === undefined) {
  return res.status(401).json({
    message: "Authentication required",
  });
}

 const { page, limit, completed, search } = result.data;

const skip = (page - 1) * limit;

const { tasks, total } = await getTasksService(skip, limit, completed, search,req.userId );

const totalPages = Math.ceil(total / limit);

res.json({
  tasks,
  page,
  limit,
  total,
  totalPages,
});
};
//Get a sigle task function
export const getTaskById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (req.userId === undefined) {
  return res.status(401).json({
    message: "Authentication required",
  });
}

  const task = await getTaskByIdService(id, req.userId);

  res.json({
    task,
  });
};
//Update Task function
export const updateTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  if (req.userId === undefined) {
  return res.status(401).json({
    message: "Authentication required",
  });
}

  const task = await updateTaskService(id, req.userId, result.data);

  res.json({
    message: "Task updated successfully",
    task,
  });
};

//Delete task function
export const deleteTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (req.userId === undefined) {
  return res.status(401).json({
    message: "Authentication required",
  });
}

  await deleteTaskService(id, req.userId);

  res.json({
    message: "Task deleted successfully",
  });
};