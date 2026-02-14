import mongoose from "mongoose";

export async function connectMongo(): Promise<typeof mongoose> {
  const port = process.env.MONGO_PORT || "27017";
  const dbName = process.env.MONGO_DB_NAME || "varejao";
  const url = process.env.MONGO_URL || `mongodb://localhost:${port}/${dbName}`;

  const connection = await mongoose.connect(url);
  console.log(`✅ MongoDB (${dbName}) conectado com sucesso`);
  return connection;
}
