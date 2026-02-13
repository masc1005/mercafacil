import { Repository } from "typeorm";
import { IUser } from "../../domain/interfaces/IUser";
import { User } from "../../domain/entities/User";
import { UserEntity } from "../database/entities/user.entity";

export class UserRepository implements IUser {
  constructor(private readonly repository: Repository<UserEntity>) {}

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map(this.toDomain);
  }

  async findById(id: number): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({ email, isActive: true });
    return entity ? this.toDomain(entity) : null;
  }

  async create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const entity = this.repository.create({
      name: user.name,
      email: user.email,
      password: user.password,
      isActive: user.isActive,
    });

    const saved = await this.repository.save(entity);
    
    return this.toDomain(saved);
  }

  private toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      isActive: Boolean(entity.isActive),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
