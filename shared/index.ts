export type Result<T> = { data?: T; error?: string };
export type Message<T extends object> = {
  [e in keyof T]: { type: e; payload: T[e] };
}[keyof T];
export type Handler<T extends object> = {
  [e in keyof T]: (message: T[e]) => void | Promise<void>;
};

export type CTSEvent = {
  ping: string;
  query: string;
  config: string;
};

export type STCEvent = {
  error: Result<any>;
  queryResult: Result<any>;
  configResult: Result<string>;
  samples: Result<any>;
};

export type CTSEventName = keyof CTSEvent;
export type STCEventName = keyof STCEvent;

export type CTSMessage = Message<CTSEvent>;
export type STCMessage = Message<STCEvent>;

export type CTSHandler = Handler<CTSEvent>;
export type STCHandler = Handler<STCEvent>;

export const toMap = <M extends object>(m: M) => {
  return new Map(Object.entries(m));
};
