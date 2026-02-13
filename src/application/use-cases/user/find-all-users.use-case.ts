import { IUser } from "../../../domain/interfaces/IUser";
import { User } from "../../../domain/entities/User";

export class FindAllUsersUseCase {
  constructor(private readonly userRepository: IUser) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
