import { IUser } from "../../../domain/interfaces/IUser";
import { compare } from 'bcrypt'
import { LoginDTO } from "../../dtos/user/login.dto";
import jwt from "jsonwebtoken"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class LoginUseCase {
  constructor(private readonly userRepository: IUser) {}

  async execute(input: LoginDTO): Promise<{token: string}> {
    if (!input.email || !EMAIL_REGEX.test(input.email)) {
      throw new Error("Email inválido");
    }

    if (!input.password || input.password.trim().length === 0) {
      throw new Error("Senha é obrigatória");
    }

    const existingUser = await this.userRepository.findByEmail(input.email);

    if (!existingUser) {
      throw new Error("Usuário não existe");
    }

    if(!existingUser.isActive) {
      throw new Error("Usuário inativo")
    }

    if(input.email !== existingUser.email) {
      throw new Error("Email invalido")
    }

    const comparedPassword = await compare(input.password, existingUser.password)

    if(!comparedPassword) {
      throw new Error("Senha invalida")
    }

    const token = jwt.sign({id: existingUser.id }, process.env.AUTH_SECRET!, { expiresIn: "1d" })

    return { token }
  }
}
