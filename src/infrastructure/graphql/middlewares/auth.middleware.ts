import { MiddlewareFn } from "type-graphql";
import jwt from "jsonwebtoken";

export interface Context {
  token?: string;
  userId?: number;
}

export const AuthMiddleware: MiddlewareFn<Context> = async ({ context }, next) => {
  const token = context.token;

  if (!token) {
    throw new Error("Não autenticado: token não fornecido");
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as { id: number };
    context.userId = decoded.id;
  } catch {
    throw new Error("Não autenticado: token inválido");
  }

  return next();
};
