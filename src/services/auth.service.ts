import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { Prisma } from "../generated/prisma/client.js";
import { generateToken } from "../lib/jwt.js";
import { AppError } from "../types/app-error.js";

//register a user
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try{
    const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
     select: {
    id: true,
    name: true,
    email: true,
    },
  });

  return user;

  } catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new AppError("Email already registered", 409);
  }
}
 
};
//login a user
export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
);

if (!isPasswordCorrect) {
  throw new AppError("Invalid email or password", 401);
}

//Generate user token
const token = generateToken(user.id);

return {
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
};
};

