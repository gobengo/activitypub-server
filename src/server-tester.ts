import { ConsoleLogFunction } from "./log.js";
import { Server } from "./server-types.js";
import { fetch } from "@web-std/fetch";
type Fetch = typeof fetch;
type UseStartedServer = (options: { fetch: Fetch; url: URL }) => Promise<void>;

type UseServer = (server: Server, use: UseStartedServer) => () => Promise<void>;

export const use: UseServer = (_server, use) => async () => {
  const log = ConsoleLogFunction();
  const { stop, url } = await _server.start({ log });
  try {
    await use({ fetch, url });
  } finally {
    await stop();
  }
};
