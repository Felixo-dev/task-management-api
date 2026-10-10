import type { Request, Response } from "express";
import { registerSchema } from "../schemas/auth.schema.js";
import { registerUser } from "../services/auth.service.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { loginUser } from "../services/auth.service.js";

//register controller
export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid registration data",
      errors: result.error.issues,
    });
  }

  const { name, email, password } = result.data;

  const user = await registerUser(name, email, password);

  return res.status(201).json({
    message: "User registered successfully",
    user,
  });
};

//login controller
export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid login data",
      errors: result.error.issues,
    });
  }

  const { email, password } = result.data;


  const loginResult = await loginUser(email, password);

  return res.status(200).json({
  message: "Login successful",
  token: loginResult.token,
  user: loginResult.user,
});
};