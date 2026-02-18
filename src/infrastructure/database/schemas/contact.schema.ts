import { Schema, model } from "mongoose";

export interface VarejaoContactDocument {
  name: string;
  cellPhone: string;
  anexo?: string;
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
