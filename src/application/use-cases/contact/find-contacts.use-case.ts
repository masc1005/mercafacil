import { IUser } from '../../../domain/interfaces/IUser';
import { IContact } from '../../../domain/interfaces/IContact';
import { Contact } from '../../../domain/entities/Contact';

export class FindContactsUseCase {
  constructor(
    private readonly userRepository: IUser,
    private readonly macapaRepository: IContact,
    private readonly varejaoRepository: IContact
  ) {}

  async execute(userId: number): Promise<Contact[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuário não existe");
    }

    const storeName = user.name.toLowerCase();

    if (storeName === 'macapa') {
      const contacts = await this.macapaRepository.findAll();
      return contacts;
    } else if (storeName === 'varejao') {
      const contacts = await this.varejaoRepository.findAll();
      return contacts;
    }

    throw new Error(`Tipo de usuário desconhecido: ${user.name}`);
  }
}
