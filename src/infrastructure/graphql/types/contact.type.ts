import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class ContactType {
  @Field(() => ID, { nullable: true })
  id?: string | number;

  @Field()  
  name: string;

  @Field()
  cellPhone: string;
}
