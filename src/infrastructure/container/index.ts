import { AppDataSource } from "../database/mysql";
import { UserRepository, MacapaContactRepository, VarejaoContactRepository } from "../repositories/";
import { ContactResolver, UserResolver } from "../graphql/resolvers";
import { UserEntity, MacapaContactEntity } from "../database/entities";
import { kafkaProducer } from "../kafka/producer";

const userRepo = new UserRepository(
  AppDataSource.getRepository(UserEntity)
);

const macapaRepo = new MacapaContactRepository(
  AppDataSource.getRepository(MacapaContactEntity)
);

const varejaoRepo = new VarejaoContactRepository();

const resolverInstances = new Map<string, object>([
  [ContactResolver.name, new ContactResolver(userRepo, kafkaProducer, macapaRepo, varejaoRepo)],
  [UserResolver.name, new UserResolver(userRepo)],
]);

export const resolverContainer = {
  get<T>(someClass: new (...args: unknown[]) => T): T {
    return (resolverInstances.get(someClass.name) as T) ?? new someClass();
  },
};
