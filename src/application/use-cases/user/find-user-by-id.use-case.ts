import { IUser } from "../../../domain/interfaces/IUser";
import { User } from "../../../domain/entities/User";

export class FindUserByIdUseCase {
  constructor(private readonly userRepository: IUser) {}

  async execute(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
