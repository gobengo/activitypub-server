import { ConsoleLogFunction, LogFunction } from "./log.js";
import { Server } from "./server-types.js";
import { fetch } from "@web-std/fetch";
type Fetch = typeof fetch;
type UseStartedServer = (options: { fetch: Fetch; url: URL }) => Promise<void>;

type UseServer = (server: Server, use: UseStartedServer) => () => Promise<void>;

function TestLogFunction(): LogFunction {
  return (level, ...loggables) => {
    if (!process.env.DEBUG) {
      return;
    }
    return ConsoleLogFunction()(level, ...loggables);
  };
}

export const use: UseServer = (_server, doWork) => async () => {
  const log = TestLogFunction();
  const { stop, url } = await _server.start({ log });
  try {
    await doWork({ fetch, url });
  } finally {
    await stop();
  }
};
