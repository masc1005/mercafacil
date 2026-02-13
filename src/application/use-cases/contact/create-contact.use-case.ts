import { IUser } from '../../../domain/interfaces/IUser';
import { CreateContactDTO } from '../../dtos/contact/create-contact.dto';
import { KafkaProducerService } from "../../../infrastructure/kafka/producer";
import { formatPhone, extractDigits } from '../../utils/format-phone';

const TOPIC_MAP: Record<string, string> = {
  macapa: 'macapa-contacts',
  varejao: 'varejao-contacts',
};

export class CreateContactUseCase {
  constructor(
    private readonly userRepository: IUser,
    private readonly producer: KafkaProducerService
  ) {}

  async execute(input: CreateContactDTO): Promise<{ message: string }> {
    if (!input.name || input.name.trim().length < 2) {
      throw new Error("Nome é obrigatório e deve ter pelo menos 2 caracteres");
    }

    if (!input.phone || input.phone.trim().length === 0) {
      throw new Error("Telefone é obrigatório");
    }

    const digits = extractDigits(input.phone);
    if (digits.length < 13) {
      throw new Error("Telefone deve conter pelo menos 13 dígitos");
    }

    const existingUser = await this.userRepository.findById(input.userId);

    if (!existingUser) {
      throw new Error("Usuário não existe");
    }

    const storeName = existingUser.name.toLowerCase();
    const topic = TOPIC_MAP[storeName];

    if (!topic) {
      throw new Error(`Tipo de usuário desconhecido: ${existingUser.name}`);
    }

    const formattedPhone = formatPhone(input.phone, storeName);

    await this.producer.send(topic, {
      name: input.name,
      cellPhone: formattedPhone,
    });

    return { message: "Dado recebido, logo os dados estarão disponíveis para consulta" };
  }
}
