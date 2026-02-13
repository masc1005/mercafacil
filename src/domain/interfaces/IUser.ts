import { User } from "../entities/User";

export interface IUser {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
}
