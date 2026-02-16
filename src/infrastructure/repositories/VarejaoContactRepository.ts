import { IContact } from "../../domain/interfaces/IContact";
import { Contact } from "../../domain/entities/Contact";
import { VarejaoContactModel, VarejaoContactDocument } from "../database/schemas/contact.schema";
import { Model, Types } from "mongoose";
import { AnexoGenerator } from "../../application/utils/anexo-generator";

interface VarejaoDoc extends VarejaoContactDocument {
  _id: Types.ObjectId;
}

export class VarejaoContactRepository implements IContact {
  constructor(private readonly model: Model<VarejaoContactDocument> = VarejaoContactModel) {}

  async findAll(): Promise<Contact[]> {
    const docs = await this.model.find()
      .select(['id', 'name', 'cellPhone']).lean<VarejaoDoc[]>();
    return docs.map(this.toDomain);
  }

  async findById(id: number | string): Promise<Contact | null> {
    const doc = await this.model.findById(id).lean<VarejaoDoc | null>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByPhone(phone: string): Promise<Contact | null> {
    const doc = await this.model.findOne({ cellPhone: phone }).lean<VarejaoDoc | null>();
    return doc ? this.toDomain(doc) : null;
  }

  async create(contact: Omit<Contact, "id">): Promise<Contact> {
    const doc = await this.model.create({
      name: contact.name,
      cellPhone: contact.cellPhone,
      anexo: contact.anexo || AnexoGenerator.generateMongoQuery(contact, 'contacts'),
    });
    return this.toDomain(doc.toObject() as VarejaoDoc);
  }

  private toDomain(doc: VarejaoDoc): Contact {
    return {
      id: doc._id.toString(),
      name: doc.name,
      cellPhone: doc.cellPhone,
    };
  }
}
