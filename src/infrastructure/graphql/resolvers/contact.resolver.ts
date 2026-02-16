import { Resolver, Arg, Mutation, UseMiddleware, Ctx, Query } from "type-graphql";
import { AuthMiddleware, Context } from "../middlewares/auth.middleware";
import { MessageType } from "../types/message.type";
import { CreateContactUseCase } from '../../../application/use-cases/contact/create-contact.use-case'
import { FindContactsUseCase } from '../../../application/use-cases/contact/find-contacts.use-case'
import { IUser } from "../../../domain/interfaces/IUser";
import { KafkaProducerService } from "../../kafka/producer";
import { ContactInput } from "../inputs/contact.input";
import { ContactType } from "../types/contact.type";
import { IContact } from "../../../domain/interfaces/IContact";

@Resolver(() => MessageType)
export class ContactResolver {
  private readonly createContactUseCase: CreateContactUseCase
  private readonly findContactsUseCase: FindContactsUseCase

  constructor(
    private readonly userRepository: IUser,
    private readonly kafkaProducer: KafkaProducerService,
    private readonly macapaRepository: IContact,
    private readonly varejaoRepository: IContact
  ) {
    this.createContactUseCase = new CreateContactUseCase(userRepository, kafkaProducer, macapaRepository, varejaoRepository);
    this.findContactsUseCase = new FindContactsUseCase(userRepository, macapaRepository, varejaoRepository);
  }

  @UseMiddleware(AuthMiddleware)
  @Mutation(() => MessageType)
  async createContact(
    @Arg("contacts", () => [ContactInput]) contacts: ContactInput[], 
    @Ctx() ctx: Context
  ): Promise<MessageType> {
    const contactsDTO = contacts.map(contact => ({
      name: contact.name,
      phone: contact.cellphone,
      userId: ctx.userId!
    }));


    return this.createContactUseCase.execute(contactsDTO);
  }

  @UseMiddleware(AuthMiddleware)
  @Query(() => [ContactType])
  async getContacts(@Ctx() ctx: Context): Promise<ContactType[]> {
    return this.findContactsUseCase.execute(ctx.userId!);
  }
}
