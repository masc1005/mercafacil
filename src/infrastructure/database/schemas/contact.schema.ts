import { Schema, model } from "mongoose";

export interface VarejaoContactDocument {
  name: string;
  cellPhone: string;
  anexo?: string; // Stores MongoDB insert query like: "db.contacts.insert({nome: 'Marina Rodrigues', telefone: '5541996941919'})"
}

const varejaoContactSchema = new Schema<VarejaoContactDocument>(
  {
    name: { type: String, required: true },
    cellPhone: { type: String, required: true },
    anexo: { type: String, required: false },
  },
  {
    collection: "contacts",
    timestamps: false,
    versionKey: false,
  }
);

export const VarejaoContactModel = model<VarejaoContactDocument>("VarejaoContact", varejaoContactSchema);
