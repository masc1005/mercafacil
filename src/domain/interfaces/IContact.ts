import { Contact } from "../entities/Contact";

export interface IContact {
  findAll(): Promise<Contact[]>;
  findById(id: number | string): Promise<Contact | null>;
  create(contact: Omit<Contact, "id">): Promise<Contact>;
}
