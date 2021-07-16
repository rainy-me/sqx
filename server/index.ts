import fastify from "fastify";
import fastifyWebsocket from "fastify-websocket";
import { socket } from "./socket";

const server = fastify();

server.register(fastifyWebsocket);

server.get("/api/ws", { websocket: true }, socket.handle);

server.listen(4000, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
