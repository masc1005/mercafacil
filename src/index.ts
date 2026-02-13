import "reflect-metadata";
import "dotenv/config";
import { connectMySQL } from "./infrastructure/database/mysql";
import { connectMongo } from "./infrastructure/database/mongo";
import { createServer } from "./infrastructure/graphql/server";
import { startMacapaConsumer } from "./infrastructure/kafka/consumers/macapa.consumer";
import { startVarejaoConsumer } from "./infrastructure/kafka/consumers/varejao.consumer";

async function main() {
  try {
    await connectMySQL();
    await connectMongo();

    await startMacapaConsumer();
    await startVarejaoConsumer();

    const port = Number(process.env.APP_PORT) || 3000;
    const url = await createServer(port);

    console.log(`🚀 Servidor GraphQL rodando em ${url}`);
  } catch (error) {
    console.error("❌ Erro ao iniciar aplicação:", error);
    process.exit(1);
  }
}

main();
