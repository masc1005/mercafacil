import { Resolver, Query, Arg, Mutation, UseMiddleware, Ctx } from "type-graphql";
import { UserType } from "../types/user.type";
import { AuthType } from "../types/auth.type";
import { UserInput } from "../inputs/user.input";
import { LoginInput } from "../inputs/login.input";
import { IUser } from "../../../domain/interfaces/IUser";
import { 
  FindAllUsersUseCase, 
  FindUserByIdUseCase, 
  CreateUserUseCase, 
  LoginUseCase 
} from "../../../application/use-cases/user";
import { AuthMiddleware, Context } from "../middlewares/auth.middleware";

@Resolver(() => UserType)
export class UserResolver {
  private readonly findAllUseCase: FindAllUsersUseCase;
  private readonly findByIdUseCase: FindUserByIdUseCase;
  private readonly createUseCase: CreateUserUseCase;
  private readonly loginUseCase: LoginUseCase;

  constructor(private readonly userRepository: IUser) {
    this.findAllUseCase = new FindAllUsersUseCase(userRepository);
    this.findByIdUseCase = new FindUserByIdUseCase(userRepository);
    this.createUseCase = new CreateUserUseCase(userRepository);
    this.loginUseCase = new LoginUseCase(userRepository);
  }

  @Query(() => [UserType], { name: "users" })
  async findAll(): Promise<UserType[]> {
    return this.findAllUseCase.execute() as Promise<UserType[]>;
  }

  @UseMiddleware(AuthMiddleware)
  @Query(() => UserType, { name: "user", nullable: true })
  async findById(@Ctx() ctx: Context): Promise<UserType | null> {
    return this.findByIdUseCase.execute(ctx.userId!) as Promise<UserType | null>;
  }

  @Mutation(() => UserType)
  async createUser(@Arg("usuario") usuario: UserInput): Promise<UserType> {
    const user = await this.createUseCase.execute({
      name: usuario.name,
      email: usuario.email,
      password: usuario.password,
      isActive: usuario.isActive,
    });
    return user as UserType;
  }

  @Mutation(() => AuthType)
  async login(@Arg("credenciais") credenciais: LoginInput): Promise<AuthType> {
    return this.loginUseCase.execute({
      email: credenciais.email,
      password: credenciais.password,
    });
  }
}
