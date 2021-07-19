import { ref } from "vue";
import debounce from "lodash.debounce";
import { toMap, CTSMessage, STCHandler, STCMessage, Result } from "sqx/shared";
const ws = new WebSocket("ws://localhost:4000/api/ws");

const send = debounce(
  (message: CTSMessage) => ws.send(JSON.stringify(message)),
  500
);

export const queryResult = ref<Result<any>>({});
export const sampleResult = ref<any[]>([]);

const handlers = toMap<STCHandler>({
  samples(message) {
    sampleResult.value = message.data;
  },
  queryResult(message) {
    queryResult.value = message;
  },
  configResult(message) {},
  error(error) {
    queryResult.value.error = error.error;
  },
});

ws.onmessage = (e) => {
  const message = JSON.parse(e.data) as STCMessage;
  console.log(message);
  handlers.get(message.type)?.(message.payload);
};

export const socket = {
  send,
  ready(fn: () => void) {
    ws.onopen = fn;
  },
};
