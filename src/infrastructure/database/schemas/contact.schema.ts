import { Schema, model } from "mongoose";

export interface VarejaoContactDocument {
  name: string;
  cellPhone: string;
}

const varejaoContactSchema = new Schema<VarejaoContactDocument>(
  {
    name: { type: String, required: true },
    cellPhone: { type: String, required: true },
  },
  {
    collection: "contacts",
    timestamps: false,
  }
);

export const VarejaoContactModel = model<VarejaoContactDocument>("VarejaoContact", varejaoContactSchema);
