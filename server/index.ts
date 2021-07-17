import fastify from "fastify";
import fastifyWebsocket from "fastify-websocket";
import { socket } from "./socket";

export type ServerConfig = {
  port: number;
  databaseURL?: number;
};

export function start(config: ServerConfig) {
  const server = fastify();

  server.register(fastifyWebsocket);

  server.get("/api/ws", { websocket: true }, socket.handle);

  server.listen(config.port, (err) => {
    console.log(`start server on ${config.port}`);
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  });
}

if (!__filename.includes("cli")) {
  start({ port: 4000 });
}
