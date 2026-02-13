import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { resolvers } from "./resolvers";
import { resolverContainer } from "../container";
import { Context } from "./middlewares/auth.middleware";

export async function createServer(port: number) {
  const schema = await buildSchema({
    resolvers,
    container: resolverContainer,
    validate: false,
    emitSchemaFile: "./schema.graphql"
  });

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }): Promise<Context> => {
      const auth = req.headers.authorization || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
      return { token };
    },
  });

  return url;
}

