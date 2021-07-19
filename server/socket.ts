import { SocketStream } from "fastify-websocket";
import { toMap, CTSHandler, CTSMessage, STCMessage } from "sqx/shared";
import { db } from "sqx/server/db";

export const socket = {
  handle(connection: SocketStream) {
    const send = (stcMessage: STCMessage) => {
      return connection.socket.send(JSON.stringify(stcMessage));
    };

    const handlers = toMap<CTSHandler>({
      async config(payload) {
        db.connect(payload);
        send({
          type: "configResult",
          payload: { data: "ok" },
        });
        send({
          type: "samples",
          payload: await db.driver!.sample(),
        });
      },
      async query(payload) {
        send({
          type: "queryResult",
          payload: await db.driver!.query(payload),
        });
      },
      ping() {},
    });

    connection.socket.on("message", async (message: string) => {
      const ctsMessage = JSON.parse(message) as CTSMessage;
      try {
        await handlers.get(ctsMessage.type)?.(ctsMessage.payload as any);
      } catch (error) {
        send({ type: "error", payload: error });
      }
    });
  },
};
