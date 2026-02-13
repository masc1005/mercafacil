import { Resolver, Arg, Mutation, UseMiddleware, Ctx } from "type-graphql";
import { AuthMiddleware, Context } from "../middlewares/auth.middleware";
import { MessageType } from "../types/message.type";
import { CreateContactUseCase } from '../../../application/use-cases/contact/create-contact.use-case'
import { IUser } from "../../../domain/interfaces/IUser";
import { KafkaProducerService } from "../../kafka/producer";
import { ContactInput } from "../inputs/contact.input";

@Resolver(() => MessageType)
export class ContactResolver {
  private readonly createContactUseCase: CreateContactUseCase

  constructor(
    private readonly userRepository: IUser,
    private readonly kafkaProducer: KafkaProducerService
  ) {
    this.createContactUseCase = new CreateContactUseCase(userRepository, kafkaProducer);
  }

  @UseMiddleware(AuthMiddleware)
  @Mutation(() => MessageType)
  async createContact(@Arg("contact") contact: ContactInput, @Ctx() ctx: Context): Promise<MessageType> {
    return this.createContactUseCase.execute({
        name: contact.name,
        phone: contact.cellPhone,
        userId: ctx.userId!
    });
  }
}
