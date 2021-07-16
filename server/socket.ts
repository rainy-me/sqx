import { SocketStream } from "fastify-websocket";
import { toMap, CTSHandler, CTSMessage, STCMessage } from "sqx/shared";
import { db } from "sqx/server/db";

export const socket = {
  handle(connection: SocketStream) {
    const send = (stcMessage: STCMessage) => {
      return connection.socket.send(JSON.stringify(stcMessage));
    };

    const handlers = toMap<CTSHandler>({
      config(payload) {
        db.connect(payload);
        send({
          type: "configResult",
          payload: { data: "ok" },
        });
      },
      async query(payload) {
        send({
          type: "queryResult",
          payload: await db.query(payload),
        });
      },
    });

    connection.socket.on("message", (message: string) => {
      const ctsMessage = JSON.parse(message) as CTSMessage;
      try {
        handlers.get(ctsMessage.type)?.(ctsMessage.payload as any);
      } catch (error) {
        send({ type: "error", payload: error });
      }
    });
  },
};
