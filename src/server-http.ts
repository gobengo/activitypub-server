import type {
  Server,
  ServerOptions,
  StartServerResponse,
} from "./server-types";
import * as nodeHttp from "http";
import { addressUrl, listen } from "./http.js";

export function NodeRequestListenerServer(
  listener: nodeHttp.RequestListener
): Server {
  /** start a server */
  async function start({
    log,
    port,
  }: ServerOptions): Promise<StartServerResponse> {
    const httpServer = nodeHttp.createServer(listener);
    async function stop() {
      await new Promise((resolve, reject) => {
        log("debug", "closing server");
        httpServer.close((error) => (error ? reject(error) : resolve(true)));
      });
    }
    await listen(httpServer, port ?? 0);
    const url = addressUrl(httpServer.address());
    log("info", "started server", url.toString());
    return { stop, url };
  }

  return {
    start,
  };
}
