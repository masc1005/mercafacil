import { ContactResolver } from "./contact.resolver";
import { UserResolver } from "./user.resolver";
import { NonEmptyArray } from "type-graphql";

export { ContactResolver, UserResolver };

export const resolvers: NonEmptyArray<Function> = [
  ContactResolver,
  UserResolver,
];
