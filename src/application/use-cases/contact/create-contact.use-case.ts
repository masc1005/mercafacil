import { IUser } from '../../../domain/interfaces/IUser';
import { CreateContactDTO } from '../../dtos/contact/create-contact.dto';
import { KafkaProducerService } from "../../../infrastructure/kafka/producer";
import { formatPhone, extractDigits } from '../../utils/format-phone';
import { IContact } from '../../../domain/interfaces/IContact';
import { formatName } from '../../utils/format-name';

const TOPIC_MAP: Record<string, string> = {
  macapa: 'macapa-contacts',
  varejao: 'varejao-contacts',
};

export class CreateContactUseCase {
  constructor(
    private readonly userRepository: IUser,
    private readonly producer: KafkaProducerService,
    private readonly macapaRepository: IContact,
    private readonly varejaoRepository: IContact
  ) { }

  async execute(input: CreateContactDTO | CreateContactDTO[]): Promise<{ messages: string[] }> {
    const contacts = Array.isArray(input) ? input : [input];

    let messages: string[] = [];

    if (contacts.length === 0) {
      throw new Error("Lista de contatos não pode ser vazia");
    }

    await Promise.all(
      contacts.map(async (contact) => {
        if (!contact.name || contact.name.trim().length < 2) {
          throw new Error(`Nome inválido para o contato: ${contact.name || 'Sem nome'}`);
        }

        if (!contact.phone || contact.phone.trim().length === 0) {
          throw new Error(`Telefone é obrigatório para o contato: ${contact.name}`);
        }

        const digits = extractDigits(contact.phone);
        if (digits.length < 13) {
          throw new Error(`Telefone do contato ${contact.name} deve conter pelo menos 13 dígitos`);
        }

        const existingUser = await this.userRepository.findById(contact.userId);

        if (!existingUser) {
          throw new Error(`Usuário não encontrado para o ID: ${contact.userId}`);
        }

        const storeName = existingUser.name.toLowerCase();

        if (existingUser.email.includes('macapa')) {
          const formattedPhone = formatPhone(contact.phone, storeName);
          const contacts = await this.macapaRepository.findByPhone(formattedPhone);

          if (contacts) {
            messages.push(`Contato com telefone ${contact.phone} já existe para o usuário ${existingUser.name}`);
            return null;
          }
        } else if (existingUser.email.includes('varejao')) {
          const formattedPhone = formatPhone(contact.phone, storeName);
          const contacts = await this.varejaoRepository.findByPhone(formattedPhone);

          if (contacts) {
            messages.push(`Contato com telefone ${contact.phone} já existe para o usuário ${existingUser.name}`);
            return null;
          }
        }

        const topic = TOPIC_MAP[storeName];

        if (!topic) {
          throw new Error(`Tipo de usuário desconhecido: ${existingUser.name}`);
        }

        const formattedPhone = formatPhone(contact.phone, storeName);
        const formattedName = formatName(contact.name, storeName);
        await this.producer.send(topic, {
          name: formattedName,
          cellPhone: formattedPhone,
        });

        messages.push(
          `Contato ${contact.name} enviado para processamento, logo estara disponivel para consulta para o cliente ${existingUser.name}!`
        );
      })
    );

    return { messages };
  }
}