import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AuthenticationError } from "../utils/AppError.js";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    throw new AuthenticationError("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "8h" });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) {
    throw new AuthenticationError("User not found");
  }
  return user;
}
