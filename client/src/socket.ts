import { ref } from "vue";
import { toMap, CTSMessage, STCHandler, STCMessage, Result } from "sqx/shared";
const ws = new WebSocket("ws://localhost:4000/api/ws");

const send = (message: CTSMessage) => ws.send(JSON.stringify(message));

export const queryResult = ref<Result<any>>({});

const handlers = toMap<STCHandler>({
  queryResult(message) {
    queryResult.value = message;
  },
  configResult(message) {
    console.log(message);
  },
  error(error) {
    queryResult.value.error = error.error;
  },
});

ws.onmessage = (e) => {
  const message = JSON.parse(e.data) as STCMessage;
  handlers.get(message.type)?.(message.payload);
};

export const socket = {
  send,
  ready(fn: () => void) {
    ws.onopen = fn;
  },
};
