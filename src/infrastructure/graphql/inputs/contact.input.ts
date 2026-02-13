import { InputType, Field } from "type-graphql";

@InputType()
export class ContactInput {
  @Field()  
  name: string;

  @Field()
  cellPhone: string;
}
