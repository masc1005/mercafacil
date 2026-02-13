import { IUser } from "../../../domain/interfaces/IUser";
import { User } from "../../../domain/entities/User";
import { hash } from 'bcrypt'
import { CreateUserDTO } from "../../dtos/user/create-user.dto";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUser) {}

  async execute(input: CreateUserDTO): Promise<User> {
    if (!input.name || input.name.trim().length < 2) {
      throw new Error("Nome é obrigatório e deve ter pelo menos 2 caracteres");
    }

    if (!input.email || !EMAIL_REGEX.test(input.email)) {
      throw new Error("Email inválido");
    }

    if (!input.password || input.password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new Error("Usuário com esse email já existe");
    }

    const hashedPassword = await hash(input.password, 10)

    return this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      isActive: input.isActive,
    });
  }
}
