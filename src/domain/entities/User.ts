export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
