import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class AuthType {
  @Field()
  token: string;
}
