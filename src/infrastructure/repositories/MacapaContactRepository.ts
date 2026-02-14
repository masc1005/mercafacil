import { Repository } from "typeorm";
import { IContact } from "../../domain/interfaces/IContact";
import { Contact  } from "../../domain/entities/Contact";
import { MacapaContactEntity } from "../database/entities/contact.entity";
import { AnexoGenerator } from "../../application/utils/anexo-generator";

export class MacapaContactRepository implements IContact {
  constructor(private readonly repository: Repository<MacapaContactEntity>) {}

  async findAll(): Promise<Contact[]> {
    const entities = await this.repository.find();
    return entities.map(this.toDomain);
  }

  async findById(id: number): Promise<Contact | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async create(contact: Omit<Contact, "id">): Promise<Contact> {
    const entity = this.repository.create({
      name: contact.name,
      cellPhone: contact.cellPhone,
      anexo: contact.anexo || AnexoGenerator.generateSqlQuery(contact, 'contacts'),
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(entity: MacapaContactEntity): Contact {
    return {
      id: entity.id,
      name: entity.name,
      cellPhone: entity.cellPhone,
      anexo: entity.anexo,
    };
  }
}
