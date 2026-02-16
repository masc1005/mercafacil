import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class MessageType {
  @Field(() => [String])
  messages: string[];
}
